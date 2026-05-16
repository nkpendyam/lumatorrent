use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineHealth {
    pub ok: bool,
    pub api_version: String,
    pub engine_version: String,
    pub torrent_backend: EngineBackend,
    pub uptime_seconds: u64,
    pub started_at_iso: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum EngineBackend {
    Mock,
    Stub,
    Libtorrent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TorrentSummary {
    pub id: Uuid,
    pub info_hash: Option<String>,
    pub name: String,
    pub status: TorrentStatus,
    pub progress: f32,
    pub download_speed_bytes: u64,
    pub upload_speed_bytes: u64,
    pub eta_seconds: Option<u64>,
    pub health: Health,
    pub health_confidence: f32,
    pub seeders: u32,
    pub peers: u32,
    pub size_bytes: u64,
    pub downloaded_bytes: u64,
    pub uploaded_bytes: u64,
    pub save_path: String,
    pub added_at_iso: DateTime<Utc>,
}

#[derive(Debug, Clone)]
pub struct TorrentRecord {
    pub summary: TorrentSummary,
    pub files: Vec<TorrentFileEntry>,
}

impl From<TorrentSummary> for TorrentRecord {
    fn from(summary: TorrentSummary) -> Self {
        Self {
            summary,
            files: Vec::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TorrentFileEntry {
    pub id: String,
    pub relative_path: String,
    pub size_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TorrentStatus {
    Checking,
    Metadata,
    Downloading,
    Paused,
    Completed,
    Seeding,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Health {
    Excellent,
    Good,
    Weak,
    Dead,
    Checking,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddTorrentRequest {
    pub magnet_uri: String,
    pub save_path: String,
    pub selected_files: Option<Vec<String>>,
    pub start_paused: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddTorrentFileRequest {
    pub torrent_file_path: String,
    pub save_path: String,
    pub start_paused: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AddTorrentResponse {
    pub torrent_id: Uuid,
    pub status: TorrentStatus,
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveTorrentRequest {
    pub delete_files: Option<bool>,
    pub use_trash: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveTorrentResponse {
    pub ok: bool,
    pub removed_from_app: bool,
    pub files_trashed: Vec<String>,
    pub files_missing: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SpeedDiagnostic {
    pub torrent_id: Uuid,
    pub summary: String,
    pub causes: Vec<DiagnosticCause>,
    pub recommendations: Vec<Recommendation>,
    pub generated_at_iso: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticCause {
    pub code: String,
    pub severity: String,
    pub title: String,
    pub message: String,
    pub technical_details: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Recommendation {
    pub id: String,
    pub label: String,
    pub description: String,
    pub action: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineError {
    pub code: String,
    pub message: String,
    pub recoverable: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineEvent {
    #[serde(rename = "type")]
    pub event_type: String,
    pub timestamp: DateTime<Utc>,
    pub sequence: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub torrent_id: Option<Uuid>,
    pub payload: Value,
}
