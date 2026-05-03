use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TorrentSummary {
    pub id: Uuid,
    pub name: String,
    pub status: TorrentStatus,
    pub progress: f32,
    pub download_speed: u64,
    pub upload_speed: u64,
    pub eta_seconds: Option<u64>,
    pub health: Health,
    pub seeders: u32,
    pub peers: u32,
    pub size_bytes: u64,
    pub downloaded_bytes: u64,
    pub uploaded_bytes: u64,
    pub save_path: String,
    pub added_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TorrentStatus {
    Checking,
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
    pub magnet_or_path: String,
    pub save_path: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticResponse {
    pub torrent_id: Uuid,
    pub confidence: f32,
    pub causes: Vec<DiagnosticCause>,
    pub recommendations: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticCause {
    pub code: String,
    pub severity: String,
    pub message: String,
    pub fixable: bool,
}
