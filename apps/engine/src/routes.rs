use crate::model::{
    AddTorrentRequest, AddTorrentResponse, DiagnosticCause, EngineBackend, EngineError,
    EngineHealth, Health, Recommendation, SpeedDiagnostic, TorrentStatus, TorrentSummary,
};
use crate::safety::{validate_download_root, validate_torrent_relative_path};
use crate::state::AppState;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

const API_VERSION: &str = "v1";

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/v1/health", get(health))
        .route("/health", get(health))
        .route("/v1/torrents", get(list_torrents))
        .route("/v1/torrents/magnet", post(add_magnet))
        .route("/v1/torrents/file", post(add_file_placeholder))
        .route("/v1/torrents/:id/pause", post(pause_torrent))
        .route("/v1/torrents/:id/resume", post(resume_torrent))
        .route("/v1/torrents/:id/remove", post(remove_torrent))
        .route("/v1/torrents/:id/recheck", post(recheck_torrent))
        .route("/v1/torrents/:id/diagnose", post(diagnose_torrent))
        .route("/v1/events", get(events_placeholder))
        .with_state(state)
}

async fn health(State(state): State<AppState>, headers: HeaderMap) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }

    Json(EngineHealth {
        ok: true,
        api_version: API_VERSION.to_string(),
        engine_version: env!("CARGO_PKG_VERSION").to_string(),
        torrent_backend: EngineBackend::Mock,
        uptime_seconds: (Utc::now() - state.started_at_iso).num_seconds().max(0) as u64,
        started_at_iso: state.started_at_iso,
    })
    .into_response()
}

fn check_auth(
    headers: &HeaderMap,
    state: &AppState,
) -> Result<(), (StatusCode, Json<EngineError>)> {
    let version = headers
        .get("x-luma-engine-version")
        .and_then(|value| value.to_str().ok());
    if version != Some(API_VERSION) {
        return Err(engine_error(
            StatusCode::BAD_REQUEST,
            "ENGINE_UNAVAILABLE",
            "Engine API version header is missing or unsupported.",
            true,
        ));
    }

    let Some(value) = headers.get("x-luma-engine-token") else {
        return Err(engine_error(
            StatusCode::UNAUTHORIZED,
            "PERMISSION_DENIED",
            "Engine auth token is missing.",
            true,
        ));
    };
    if value.to_str().ok() != Some(state.auth_token.as_str()) {
        return Err(engine_error(
            StatusCode::UNAUTHORIZED,
            "PERMISSION_DENIED",
            "Engine auth token is invalid.",
            true,
        ));
    }
    Ok(())
}

async fn list_torrents(State(state): State<AppState>, headers: HeaderMap) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let torrents = state.torrents.read().await.clone();
    Json(torrents).into_response()
}

async fn add_magnet(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<AddTorrentRequest>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    if payload.magnet_uri.trim().is_empty() || !payload.magnet_uri.starts_with("magnet:?") {
        return engine_error(
            StatusCode::BAD_REQUEST,
            "INVALID_MAGNET",
            "Magnet URI is missing or invalid.",
            true,
        )
        .into_response();
    }
    if let Err(message) = validate_download_root(&payload.save_path) {
        return engine_error(StatusCode::BAD_REQUEST, "PATH_REJECTED", &message, true)
            .into_response();
    }
    if let Some(selected_files) = payload.selected_files.as_ref() {
        for file_path in selected_files {
            if let Err(message) = validate_torrent_relative_path(file_path) {
                return engine_error(StatusCode::BAD_REQUEST, "PATH_REJECTED", &message, true)
                    .into_response();
            }
        }
    }

    let status = if payload.start_paused.unwrap_or(false) {
        TorrentStatus::Paused
    } else {
        TorrentStatus::Metadata
    };
    let torrent = TorrentSummary {
        id: Uuid::new_v4(),
        name: infer_display_name(&payload.magnet_uri),
        status: status.clone(),
        progress: 0.0,
        download_speed_bytes: 0,
        upload_speed_bytes: 0,
        eta_seconds: None,
        health: Health::Checking,
        health_confidence: 0.2,
        seeders: 0,
        peers: 0,
        size_bytes: 0,
        downloaded_bytes: 0,
        uploaded_bytes: 0,
        save_path: payload.save_path,
        added_at_iso: Utc::now(),
    };
    state.torrents.write().await.insert(0, torrent.clone());
    (
        StatusCode::ACCEPTED,
        Json(AddTorrentResponse {
            torrent_id: torrent.id,
            status,
        }),
    )
        .into_response()
}

async fn add_file_placeholder(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    engine_error(
        StatusCode::BAD_REQUEST,
        "TORRENT_PARSE_FAILED",
        "Torrent file import is not implemented in the mock engine scaffold.",
        true,
    )
    .into_response()
}

async fn pause_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    set_status(state, headers, id, TorrentStatus::Paused).await
}

async fn resume_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    set_status(state, headers, id, TorrentStatus::Downloading).await
}

async fn remove_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let mut torrents = state.torrents.write().await;
    let original_len = torrents.len();
    torrents.retain(|torrent| torrent.id != id);
    if torrents.len() == original_len {
        return torrent_not_found().into_response();
    }
    Json(json!({ "ok": true })).into_response()
}

async fn recheck_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    set_status(state, headers, id, TorrentStatus::Checking).await
}

async fn set_status(
    state: AppState,
    headers: HeaderMap,
    id: Uuid,
    status: TorrentStatus,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let mut torrents = state.torrents.write().await;
    let Some(torrent) = torrents.iter_mut().find(|torrent| torrent.id == id) else {
        return torrent_not_found().into_response();
    };
    torrent.status = status;
    Json(torrent.clone()).into_response()
}

async fn diagnose_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let torrents = state.torrents.read().await;
    let Some(torrent) = torrents.iter().find(|torrent| torrent.id == id) else {
        return torrent_not_found().into_response();
    };

    let mut causes = Vec::new();
    let mut recommendations = Vec::new();

    if torrent.seeders < 3 {
        causes.push(DiagnosticCause {
            code: "LOW_SEEDERS".to_string(),
            severity: "warning".to_string(),
            title: "Weak availability".to_string(),
            message: "This torrent has weak availability.".to_string(),
            technical_details: None,
        });
        recommendations.push(Recommendation {
            id: "choose-healthier-source".to_string(),
            label: "Choose healthier source".to_string(),
            description: "Keep the torrent active longer or choose a healthier legal source."
                .to_string(),
            action: None,
        });
    }

    Json(SpeedDiagnostic {
        torrent_id: id,
        summary: "Mock diagnostics only. Real tracker, DHT, peer, port, and disk signals are not connected yet.".to_string(),
        causes,
        recommendations,
        generated_at_iso: Utc::now(),
    })
    .into_response()
}

async fn events_placeholder(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    Json(json!({ "events": [] })).into_response()
}

fn engine_error(
    status: StatusCode,
    code: &str,
    message: &str,
    recoverable: bool,
) -> (StatusCode, Json<EngineError>) {
    (
        status,
        Json(EngineError {
            code: code.to_string(),
            message: message.to_string(),
            recoverable,
        }),
    )
}

fn torrent_not_found() -> (StatusCode, Json<EngineError>) {
    engine_error(
        StatusCode::NOT_FOUND,
        "ENGINE_UNAVAILABLE",
        "Torrent was not found in the mock engine.",
        true,
    )
}

fn infer_display_name(input: &str) -> String {
    if let Some(name) = input.split('&').find_map(|part| part.strip_prefix("dn=")) {
        name.replace('+', " ")
    } else {
        "Magnet download".to_string()
    }
}
