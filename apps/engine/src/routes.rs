use crate::model::{AddTorrentRequest, DiagnosticCause, DiagnosticResponse, Health, TorrentStatus, TorrentSummary};
use crate::safety::validate_download_root;
use crate::state::AppState;
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/v1/torrents", get(list_torrents))
        .route("/v1/torrents/add", post(add_torrent))
        .route("/v1/torrents/:id/pause", post(pause_torrent))
        .route("/v1/torrents/:id/resume", post(resume_torrent))
        .route("/v1/torrents/:id/diagnostics", get(diagnose_torrent))
        .with_state(state)
}

async fn health() -> impl IntoResponse {
    Json(json!({ "status": "ok", "engine": "mock" }))
}

fn check_auth(headers: &HeaderMap, state: &AppState) -> Result<(), (StatusCode, Json<serde_json::Value>)> {
    let Some(value) = headers.get("x-lumatorrent-token") else {
        return Err((StatusCode::UNAUTHORIZED, Json(json!({ "error": "missing-auth-token" }))));
    };
    if value.to_str().ok() != Some(state.auth_token.as_str()) {
        return Err((StatusCode::UNAUTHORIZED, Json(json!({ "error": "invalid-auth-token" }))));
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

async fn add_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<AddTorrentRequest>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    if payload.magnet_or_path.trim().is_empty() {
        return (StatusCode::BAD_REQUEST, Json(json!({ "error": "empty-torrent-input" }))).into_response();
    }
    if let Err(message) = validate_download_root(&payload.save_path) {
        return (StatusCode::BAD_REQUEST, Json(json!({ "error": "invalid-save-path", "message": message }))).into_response();
    }

    let torrent = TorrentSummary {
        id: Uuid::new_v4(),
        name: infer_display_name(&payload.magnet_or_path),
        status: TorrentStatus::Checking,
        progress: 0.0,
        download_speed: 0,
        upload_speed: 0,
        eta_seconds: None,
        health: Health::Checking,
        seeders: 0,
        peers: 0,
        size_bytes: 0,
        downloaded_bytes: 0,
        uploaded_bytes: 0,
        save_path: payload.save_path,
        added_at: Utc::now(),
    };
    state.torrents.write().await.insert(0, torrent.clone());
    (StatusCode::CREATED, Json(torrent)).into_response()
}

async fn pause_torrent(State(state): State<AppState>, headers: HeaderMap, Path(id): Path<Uuid>) -> impl IntoResponse {
    set_status(state, headers, id, TorrentStatus::Paused).await
}

async fn resume_torrent(State(state): State<AppState>, headers: HeaderMap, Path(id): Path<Uuid>) -> impl IntoResponse {
    set_status(state, headers, id, TorrentStatus::Downloading).await
}

async fn set_status(state: AppState, headers: HeaderMap, id: Uuid, status: TorrentStatus) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let mut torrents = state.torrents.write().await;
    let Some(torrent) = torrents.iter_mut().find(|torrent| torrent.id == id) else {
        return (StatusCode::NOT_FOUND, Json(json!({ "error": "torrent-not-found" }))).into_response();
    };
    torrent.status = status;
    Json(torrent.clone()).into_response()
}

async fn diagnose_torrent(State(state): State<AppState>, headers: HeaderMap, Path(id): Path<Uuid>) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let torrents = state.torrents.read().await;
    let Some(torrent) = torrents.iter().find(|torrent| torrent.id == id) else {
        return (StatusCode::NOT_FOUND, Json(json!({ "error": "torrent-not-found" }))).into_response();
    };

    let mut causes = Vec::new();
    let mut recommendations = Vec::new();

    if torrent.seeders < 3 {
        causes.push(DiagnosticCause {
            code: "LOW_SEEDERS".to_string(),
            severity: "warning".to_string(),
            message: "This torrent has weak availability.".to_string(),
            fixable: false,
        });
        recommendations.push("Keep the torrent active longer or choose a healthier legal source.".to_string());
    }

    causes.push(DiagnosticCause {
        code: "PORT_STATUS_UNKNOWN".to_string(),
        severity: "info".to_string(),
        message: "Port checking is not implemented in the mock engine yet.".to_string(),
        fixable: true,
    });
    recommendations.push("Implement the port checker before public beta.".to_string());

    Json(DiagnosticResponse { torrent_id: id, confidence: 0.65, causes, recommendations }).into_response()
}

fn infer_display_name(input: &str) -> String {
    if input.starts_with("magnet:") {
        "Magnet download".to_string()
    } else {
        input.rsplit(['/', '\\']).next().unwrap_or("Torrent file").to_string()
    }
}
