use crate::engine::MockEngine;
use chrono::Utc;
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub engine: MockEngine,
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
            engine: MockEngine::seeded(started_at_iso),
            auth_token,
            started_at_iso,
        }
    }
}
