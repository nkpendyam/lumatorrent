use crate::model::{
    AddTorrentFileRequest, AddTorrentRequest, AddTorrentResponse, DiagnosticCause, EngineBackend,
    EngineError, EngineHealth, Health, Recommendation, RemoveTorrentRequest, RemoveTorrentResponse,
    SpeedDiagnostic, TorrentFileEntry, TorrentRecord, TorrentStatus, TorrentSummary,
};
use crate::safe_delete::{build_safe_delete_plan, move_plan_to_trash, SafeDeleteError};
use crate::safety::validate_download_root;
use crate::state::AppState;
use crate::torrent_file::{parse_torrent_metadata, TorrentParseError};
use axum::extract::{Path, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use chrono::Utc;
use serde::Deserialize;
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
    Json(state.engine.list_torrents().await).into_response()
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
    let files = match build_mock_file_manifest(payload.selected_files.as_deref()) {
        Ok(files) => files,
        Err(message) => {
            return engine_error(StatusCode::BAD_REQUEST, "PATH_REJECTED", &message, true)
                .into_response();
        }
    };
    let info_hash = extract_magnet_info_hash(&payload.magnet_uri);
    if let Some(hash) = info_hash.as_deref() {
        if state.engine.has_duplicate_info_hash(hash).await {
            return engine_error(
                StatusCode::CONFLICT,
                "DUPLICATE_TORRENT",
                "This torrent is already in the list.",
                true,
            )
            .into_response();
        }
    }

    let status = if payload.start_paused.unwrap_or(false) {
        TorrentStatus::Paused
    } else {
        TorrentStatus::Metadata
    };
    let torrent = TorrentSummary {
        id: Uuid::new_v4(),
        info_hash,
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
    state
        .engine
        .add_record(TorrentRecord {
            summary: torrent.clone(),
            files,
        })
        .await;
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
    Json(payload): Json<AddTorrentFileRequest>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    if !payload
        .torrent_file_path
        .to_ascii_lowercase()
        .ends_with(".torrent")
    {
        return engine_error(
            StatusCode::BAD_REQUEST,
            "TORRENT_PARSE_FAILED",
            "Only .torrent files can be imported.",
            true,
        )
        .into_response();
    }
    if let Err(message) = validate_download_root(&payload.save_path) {
        return engine_error(StatusCode::BAD_REQUEST, "PATH_REJECTED", &message, true)
            .into_response();
    }

    let bytes = match tokio::fs::read(&payload.torrent_file_path).await {
        Ok(bytes) => bytes,
        Err(error) => {
            return engine_error(
                StatusCode::BAD_REQUEST,
                "TORRENT_PARSE_FAILED",
                &format!("Torrent file could not be read: {error}"),
                true,
            )
            .into_response();
        }
    };
    let metadata = match parse_torrent_metadata(&bytes) {
        Ok(metadata) => metadata,
        Err(error) => {
            return engine_error(
                StatusCode::BAD_REQUEST,
                "TORRENT_PARSE_FAILED",
                &torrent_parse_error_message(error),
                true,
            )
            .into_response();
        }
    };
    if state
        .engine
        .has_duplicate_info_hash(&metadata.info_hash)
        .await
    {
        return engine_error(
            StatusCode::CONFLICT,
            "DUPLICATE_TORRENT",
            "This torrent is already in the list.",
            true,
        )
        .into_response();
    }

    let status = if payload.start_paused.unwrap_or(false) {
        TorrentStatus::Paused
    } else {
        TorrentStatus::Checking
    };
    let torrent = TorrentSummary {
        id: Uuid::new_v4(),
        info_hash: Some(metadata.info_hash),
        name: metadata.name,
        status: status.clone(),
        progress: 0.0,
        download_speed_bytes: 0,
        upload_speed_bytes: 0,
        eta_seconds: None,
        health: Health::Checking,
        health_confidence: 0.3,
        seeders: 0,
        peers: 0,
        size_bytes: metadata.total_size_bytes,
        downloaded_bytes: 0,
        uploaded_bytes: 0,
        save_path: payload.save_path,
        added_at_iso: Utc::now(),
    };
    state
        .engine
        .add_record(TorrentRecord {
            summary: torrent.clone(),
            files: metadata.files,
        })
        .await;

    (
        StatusCode::ACCEPTED,
        Json(AddTorrentResponse {
            torrent_id: torrent.id,
            status,
        }),
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
    payload: Option<Json<RemoveTorrentRequest>>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }

    let Some(record) = state.engine.get_record(id).await else {
        return torrent_not_found().into_response();
    };

    let request = payload.map(|Json(value)| value).unwrap_or_default();
    let delete_files = request.delete_files.unwrap_or(false);
    let use_trash = request.use_trash.unwrap_or(true);
    let mut files_trashed = Vec::new();
    let mut files_missing = Vec::new();

    if delete_files {
        if !use_trash {
            return engine_error(
                StatusCode::BAD_REQUEST,
                "PATH_REJECTED",
                "Permanent delete is not supported. Use OS trash or remove from app only.",
                false,
            )
            .into_response();
        }

        let save_path = record.summary.save_path.clone();
        let files = record.files.clone();
        let trash_result = tokio::task::spawn_blocking(move || {
            let plan = build_safe_delete_plan(&save_path, &files)?;
            let trashed = move_plan_to_trash(&plan)?;
            Ok::<_, SafeDeleteError>((trashed, plan.missing_files))
        })
        .await
        .map_err(|error| SafeDeleteError::TrashUnavailable(error.to_string()))
        .and_then(|result| result);

        match trash_result {
            Ok((trashed, missing)) => {
                files_trashed = trashed;
                files_missing = missing;
            }
            Err(error) => {
                return engine_error(
                    StatusCode::BAD_REQUEST,
                    "PATH_REJECTED",
                    &error.to_string(),
                    true,
                )
                .into_response();
            }
        }
    }

    state.engine.remove_record(id).await;

    Json(RemoveTorrentResponse {
        ok: true,
        removed_from_app: true,
        files_trashed,
        files_missing,
    })
    .into_response()
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
    let Some(summary) = state.engine.set_status(id, status).await else {
        return torrent_not_found().into_response();
    };
    Json(summary).into_response()
}

async fn diagnose_torrent(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    let Some(record) = state.engine.get_record(id).await else {
        return torrent_not_found().into_response();
    };
    let torrent = &record.summary;

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
    Query(query): Query<EventsQuery>,
    headers: HeaderMap,
) -> impl IntoResponse {
    if let Err(err) = check_auth(&headers, &state) {
        return err.into_response();
    }
    Json(json!({ "events": state.engine.snapshot_events(query.after, query.limit).await }))
        .into_response()
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EventsQuery {
    after: Option<u64>,
    limit: Option<usize>,
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

fn torrent_parse_error_message(error: TorrentParseError) -> String {
    error.to_string()
}

fn infer_display_name(input: &str) -> String {
    if let Some(name) = input.split('&').find_map(|part| part.strip_prefix("dn=")) {
        name.replace('+', " ")
    } else {
        "Magnet download".to_string()
    }
}

fn extract_magnet_info_hash(input: &str) -> Option<String> {
    let query = input.strip_prefix("magnet:?")?;
    query.split('&').find_map(|part| {
        let value = part.strip_prefix("xt=")?;
        let hash = value.strip_prefix("urn:btih:").or_else(|| {
            value
                .get(..9)
                .filter(|prefix| prefix.eq_ignore_ascii_case("urn:btih:"))
                .and_then(|_| value.get(9..))
        })?;
        let normalized = hash.trim().to_ascii_lowercase();
        if normalized.is_empty() {
            None
        } else {
            Some(normalized)
        }
    })
}

fn build_mock_file_manifest(
    selected_files: Option<&[String]>,
) -> Result<Vec<TorrentFileEntry>, String> {
    selected_files
        .unwrap_or(&[])
        .iter()
        .enumerate()
        .map(|(index, relative_path)| {
            crate::safety::validate_torrent_relative_path(relative_path)?;
            Ok(TorrentFileEntry {
                id: format!("selected-{index}"),
                relative_path: relative_path.replace('\\', "/"),
                size_bytes: 0,
            })
        })
        .collect()
}

#[cfg(test)]
mod tests {
    #![allow(clippy::expect_used)]

    use super::*;

    #[test]
    fn mock_file_manifest_normalizes_selected_files() {
        let selected = vec!["folder\\legal.iso".to_string()];

        let manifest = build_mock_file_manifest(Some(&selected)).expect("manifest");

        assert_eq!(manifest[0].relative_path, "folder/legal.iso");
    }

    #[test]
    fn mock_file_manifest_rejects_unsafe_selected_files() {
        let selected = vec!["../outside.iso".to_string()];

        let error = build_mock_file_manifest(Some(&selected)).expect_err("unsafe path");

        assert_eq!(error, "parent traversal is not allowed");
    }

    #[test]
    fn extracts_magnet_info_hash_case_insensitively() {
        assert_eq!(
            extract_magnet_info_hash("magnet:?xt=urn:btih:ABC123&dn=Legal"),
            Some("abc123".to_string())
        );
        assert_eq!(extract_magnet_info_hash("magnet:?dn=Legal"), None);
    }
}
