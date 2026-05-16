use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::io::{Read, Write};
use std::net::{SocketAddr, TcpStream};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::Duration;

#[derive(Default)]
struct EngineSupervisor {
    child: Option<Child>,
    base_url: String,
    started_at_iso: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct StartEngineRequest {
    base_url: String,
    auth_token: String,
    startup_timeout_ms: u64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EngineHealthRequest {
    base_url: String,
    auth_token: String,
    health_timeout_ms: u64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct EngineProcessStatus {
    status: String,
    mode: String,
    base_url: String,
    started_at_iso: Option<String>,
    pid: Option<u32>,
}

#[tauri::command]
fn app_health() -> &'static str {
    "ok"
}

#[tauri::command]
fn start_engine(
    request: StartEngineRequest,
    supervisor: tauri::State<'_, Mutex<EngineSupervisor>>,
) -> Result<EngineProcessStatus, String> {
    validate_token(&request.auth_token)?;
    let port = parse_local_engine_port(&request.base_url)?;
    let mut supervisor = supervisor
        .lock()
        .map_err(|_| "engine supervisor lock poisoned")?;

    if let Some(child) = supervisor.child.as_mut() {
        if child
            .try_wait()
            .map_err(|error| error.to_string())?
            .is_none()
        {
            return Ok(supervisor.status("ready"));
        }
    }

    let binary = resolve_engine_binary()?;
    let child = Command::new(binary)
        .arg("--serve")
        .arg("--host")
        .arg("127.0.0.1")
        .arg("--port")
        .arg(port.to_string())
        .env("LUMATORRENT_ENGINE_TOKEN", &request.auth_token)
        .env("LUMATORRENT_ENGINE_PORT", port.to_string())
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|error| format!("failed to start local engine sidecar: {error}"))?;

    supervisor.base_url = request.base_url;
    supervisor.started_at_iso = Some(now_iso_placeholder());
    supervisor.child = Some(child);
    let _startup_timeout_ms = request.startup_timeout_ms;

    Ok(supervisor.status("starting"))
}

#[tauri::command]
fn stop_engine(
    supervisor: tauri::State<'_, Mutex<EngineSupervisor>>,
) -> Result<EngineProcessStatus, String> {
    let mut supervisor = supervisor
        .lock()
        .map_err(|_| "engine supervisor lock poisoned")?;
    if let Some(mut child) = supervisor.child.take() {
        child.kill().map_err(|error| error.to_string())?;
        let _ = child.wait();
    }
    Ok(supervisor.status("stopped"))
}

#[tauri::command]
fn engine_status(
    supervisor: tauri::State<'_, Mutex<EngineSupervisor>>,
) -> Result<EngineProcessStatus, String> {
    let mut supervisor = supervisor
        .lock()
        .map_err(|_| "engine supervisor lock poisoned")?;
    let status = if let Some(child) = supervisor.child.as_mut() {
        if child
            .try_wait()
            .map_err(|error| error.to_string())?
            .is_none()
        {
            "ready"
        } else {
            supervisor.child = None;
            "unavailable"
        }
    } else {
        "stopped"
    };
    Ok(supervisor.status(status))
}

#[tauri::command]
fn engine_health(request: EngineHealthRequest) -> Result<Value, String> {
    validate_token(&request.auth_token)?;
    http_engine_health(
        &request.base_url,
        &request.auth_token,
        request.health_timeout_ms,
    )
}

impl EngineSupervisor {
    fn status(&self, status: &str) -> EngineProcessStatus {
        EngineProcessStatus {
            status: status.to_string(),
            mode: "local-sidecar".to_string(),
            base_url: if self.base_url.is_empty() {
                "http://127.0.0.1:17391/v1".to_string()
            } else {
                self.base_url.clone()
            },
            started_at_iso: self.started_at_iso.clone(),
            pid: self.child.as_ref().map(Child::id),
        }
    }
}

fn validate_token(token: &str) -> Result<(), String> {
    if token.len() < 32 {
        return Err("engine auth token is missing or too short".to_string());
    }
    Ok(())
}

fn parse_local_engine_port(base_url: &str) -> Result<u16, String> {
    let without_scheme = base_url
        .strip_prefix("http://")
        .ok_or_else(|| "engine URL must use http on localhost".to_string())?;
    let host_port = without_scheme.split('/').next().unwrap_or_default();
    let Some((host, port)) = host_port.rsplit_once(':') else {
        return Err("engine URL must include a port".to_string());
    };
    if host != "127.0.0.1" && host != "localhost" {
        return Err("engine URL must bind to localhost only".to_string());
    }
    port.parse::<u16>()
        .map_err(|_| "engine URL port is invalid".to_string())
}

fn resolve_engine_binary() -> Result<PathBuf, String> {
    if let Ok(path) = std::env::var("LUMATORRENT_ENGINE_BIN") {
        let path = PathBuf::from(path);
        if is_allowed_engine_binary(&path) && path.is_file() {
            return Ok(path);
        }
    }

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let exe_suffix = std::env::consts::EXE_SUFFIX;
    let candidates = [
        manifest_dir.join(format!(
            "../../../target/debug/lumatorrent-engine{exe_suffix}"
        )),
        manifest_dir.join(format!(
            "../../../target/release/lumatorrent-engine{exe_suffix}"
        )),
        manifest_dir.join(format!("binaries/luma-engine{exe_suffix}")),
    ];

    candidates
        .into_iter()
        .find(|path| is_allowed_engine_binary(path) && path.is_file())
        .ok_or_else(|| "local engine sidecar binary was not found".to_string())
}

fn is_allowed_engine_binary(path: &Path) -> bool {
    let Some(file_name) = path.file_name().and_then(|value| value.to_str()) else {
        return false;
    };
    file_name.starts_with("lumatorrent-engine") || file_name.starts_with("luma-engine")
}

fn http_engine_health(base_url: &str, token: &str, timeout_ms: u64) -> Result<Value, String> {
    let port = parse_local_engine_port(base_url)?;
    let timeout = Duration::from_millis(timeout_ms.max(1));
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let mut stream = TcpStream::connect_timeout(&addr, timeout)
        .map_err(|_| "local engine is unavailable".to_string())?;
    stream
        .set_read_timeout(Some(timeout))
        .map_err(|error| error.to_string())?;
    stream
        .set_write_timeout(Some(timeout))
        .map_err(|error| error.to_string())?;

    let request = format!(
        "GET /v1/health HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\nAccept: application/json\r\nX-Luma-Engine-Version: v1\r\nX-Luma-Engine-Token: {token}\r\n\r\n"
    );
    stream
        .write_all(request.as_bytes())
        .map_err(|error| error.to_string())?;

    let mut response = String::new();
    stream
        .read_to_string(&mut response)
        .map_err(|error| error.to_string())?;
    if !response.starts_with("HTTP/1.1 200") && !response.starts_with("HTTP/1.0 200") {
        return Err("local engine health check failed".to_string());
    }
    let Some((_, body)) = response.split_once("\r\n\r\n") else {
        return Err("local engine returned malformed HTTP".to_string());
    };
    serde_json::from_str(body)
        .map_err(|error| format!("local engine returned malformed JSON: {error}"))
}

fn now_iso_placeholder() -> String {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| format!("unix:{}", duration.as_secs()))
        .unwrap_or_else(|_| "unix:0".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(EngineSupervisor::default()))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            app_health,
            start_engine,
            stop_engine,
            engine_status,
            engine_health
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|error| panic!("error while running tauri application: {error}"));
}
