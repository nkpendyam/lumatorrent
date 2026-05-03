use crate::model::{Health, TorrentStatus, TorrentSummary};
use chrono::Utc;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub torrents: Arc<RwLock<Vec<TorrentSummary>>>,
    pub auth_token: String,
    pub started_at_iso: chrono::DateTime<Utc>,
}

impl AppState {
    pub fn new_dev() -> Self {
        let auth_token = std::env::var("LUMATORRENT_ENGINE_TOKEN")
            .ok()
            .filter(|token| token.len() >= 16)
            .unwrap_or_else(|| format!("dev-{}-{}", Uuid::new_v4(), Uuid::new_v4()));
        let started_at_iso = Utc::now();
        Self {
            torrents: Arc::new(RwLock::new(vec![TorrentSummary {
                id: Uuid::new_v4(),
                name: "Ubuntu 26.04 Daily ISO".to_string(),
                status: TorrentStatus::Downloading,
                progress: 0.72,
                download_speed_bytes: 8_400_000,
                upload_speed_bytes: 450_000,
                eta_seconds: Some(180),
                health: Health::Excellent,
                health_confidence: 0.92,
                seeders: 128,
                peers: 24,
                size_bytes: 5_700_000_000,
                downloaded_bytes: 4_100_000_000,
                uploaded_bytes: 220_000_000,
                save_path: "~/Downloads/LumaTorrent".to_string(),
                added_at_iso: started_at_iso,
            }])),
            auth_token,
            started_at_iso,
        }
    }
}
