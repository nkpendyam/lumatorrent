use crate::model::{Health, TorrentStatus, TorrentSummary};
use chrono::Utc;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub torrents: Arc<RwLock<Vec<TorrentSummary>>>,
    pub auth_token: String,
}

impl AppState {
    pub fn new_dev() -> Self {
        Self {
            torrents: Arc::new(RwLock::new(vec![TorrentSummary {
                id: Uuid::new_v4(),
                name: "Ubuntu 26.04 Daily ISO".to_string(),
                status: TorrentStatus::Downloading,
                progress: 0.72,
                download_speed: 8_400_000,
                upload_speed: 450_000,
                eta_seconds: Some(180),
                health: Health::Excellent,
                seeders: 128,
                peers: 24,
                size_bytes: 5_700_000_000,
                downloaded_bytes: 4_100_000_000,
                uploaded_bytes: 220_000_000,
                save_path: "~/Downloads/LumaTorrent".to_string(),
                added_at: Utc::now(),
            }])),
            auth_token: "dev-token-change-me".to_string(),
        }
    }
}
