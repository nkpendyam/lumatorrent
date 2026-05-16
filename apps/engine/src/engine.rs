use crate::model::{EngineEvent, Health, TorrentRecord, TorrentStatus, TorrentSummary};
use chrono::{DateTime, Utc};
use serde_json::json;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

const MAX_EVENT_SNAPSHOT: usize = 1024;

#[derive(Clone)]
pub struct MockEngine {
    torrents: Arc<RwLock<Vec<TorrentRecord>>>,
    events: Arc<RwLock<Vec<EngineEvent>>>,
    next_sequence: Arc<AtomicU64>,
}

impl MockEngine {
    pub fn seeded(started_at_iso: DateTime<Utc>) -> Self {
        Self {
            torrents: Arc::new(RwLock::new(vec![TorrentSummary {
                id: Uuid::new_v4(),
                info_hash: None,
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
            }
            .into()])),
            events: Arc::new(RwLock::new(Vec::new())),
            next_sequence: Arc::new(AtomicU64::new(1)),
        }
    }

    pub async fn list_torrents(&self) -> Vec<TorrentSummary> {
        self.torrents
            .read()
            .await
            .iter()
            .map(|record| record.summary.clone())
            .collect()
    }

    pub async fn has_duplicate_info_hash(&self, info_hash: &str) -> bool {
        self.torrents.read().await.iter().any(|record| {
            record
                .summary
                .info_hash
                .as_deref()
                .is_some_and(|existing| existing.eq_ignore_ascii_case(info_hash))
        })
    }

    pub async fn add_record(&self, record: TorrentRecord) {
        let summary = record.summary.clone();
        self.torrents.write().await.insert(0, record);
        self.emit_state_event("torrent.added", &summary).await;
    }

    pub async fn get_record(&self, id: Uuid) -> Option<TorrentRecord> {
        self.torrents
            .read()
            .await
            .iter()
            .find(|record| record.summary.id == id)
            .cloned()
    }

    pub async fn remove_record(&self, id: Uuid) -> bool {
        let mut torrents = self.torrents.write().await;
        let original_len = torrents.len();
        torrents.retain(|record| record.summary.id != id);
        torrents.len() != original_len
    }

    pub async fn set_status(&self, id: Uuid, status: TorrentStatus) -> Option<TorrentSummary> {
        let mut torrents = self.torrents.write().await;
        let record = torrents.iter_mut().find(|record| record.summary.id == id)?;
        record.summary.status = status;
        let summary = record.summary.clone();
        drop(torrents);
        self.emit_state_event(state_event_type(&summary.status), &summary)
            .await;
        Some(summary)
    }

    pub async fn snapshot_events(
        &self,
        after_sequence: Option<u64>,
        limit: Option<usize>,
    ) -> Vec<EngineEvent> {
        let limit = limit.unwrap_or(MAX_EVENT_SNAPSHOT).min(MAX_EVENT_SNAPSHOT);
        self.events
            .read()
            .await
            .iter()
            .filter(|event| after_sequence.is_none_or(|after| event.sequence > after))
            .take(limit)
            .cloned()
            .collect()
    }

    async fn emit_state_event(&self, event_type: &str, summary: &TorrentSummary) {
        let sequence = self.next_sequence.fetch_add(1, Ordering::SeqCst);
        let mut events = self.events.write().await;
        events.push(EngineEvent {
            event_type: event_type.to_string(),
            timestamp: Utc::now(),
            sequence,
            torrent_id: Some(summary.id),
            payload: json!({
                "status": summary.status,
                "summary": summary,
            }),
        });
        let overflow_count = events.len().saturating_sub(MAX_EVENT_SNAPSHOT);
        if overflow_count > 0 {
            events.drain(0..overflow_count);
        }
    }
}

fn state_event_type(status: &TorrentStatus) -> &'static str {
    match status {
        TorrentStatus::Paused => "torrent.paused",
        TorrentStatus::Completed => "torrent.completed",
        TorrentStatus::Error => "torrent.error",
        TorrentStatus::Checking
        | TorrentStatus::Metadata
        | TorrentStatus::Downloading
        | TorrentStatus::Seeding => "torrent.metadata",
    }
}

#[cfg(test)]
mod tests {
    #![allow(clippy::expect_used)]

    use super::*;

    fn record_with_hash(info_hash: &str) -> TorrentRecord {
        TorrentSummary {
            id: Uuid::new_v4(),
            info_hash: Some(info_hash.to_string()),
            name: "Legal".to_string(),
            status: TorrentStatus::Metadata,
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
            save_path: "~/Downloads/LumaTorrent".to_string(),
            added_at_iso: Utc::now(),
        }
        .into()
    }

    #[tokio::test]
    async fn tracks_duplicate_info_hashes_case_insensitively() {
        let engine = MockEngine::seeded(Utc::now());
        engine.add_record(record_with_hash("ABC123")).await;

        assert!(engine.has_duplicate_info_hash("abc123").await);
        assert!(!engine.has_duplicate_info_hash("def456").await);
    }

    #[tokio::test]
    async fn updates_and_removes_records_by_id() {
        let engine = MockEngine::seeded(Utc::now());
        let record = record_with_hash("abc123");
        let id = record.summary.id;
        engine.add_record(record).await;

        let updated = engine
            .set_status(id, TorrentStatus::Paused)
            .await
            .expect("updated torrent");

        assert!(matches!(updated.status, TorrentStatus::Paused));
        assert!(engine.remove_record(id).await);
        assert!(engine.get_record(id).await.is_none());
    }

    #[tokio::test]
    async fn emits_state_events_for_add_and_status_updates() {
        let engine = MockEngine::seeded(Utc::now());
        let record = record_with_hash("abc123");
        let id = record.summary.id;
        engine.add_record(record).await;
        engine.set_status(id, TorrentStatus::Paused).await;

        let events = engine.snapshot_events(None, None).await;

        assert_eq!(events[0].event_type, "torrent.added");
        assert_eq!(events[1].event_type, "torrent.paused");
        assert_eq!(events[0].sequence, 1);
        assert_eq!(events[1].sequence, 2);
    }

    #[tokio::test]
    async fn snapshots_events_after_sequence_with_limit() {
        let engine = MockEngine::seeded(Utc::now());
        let first = record_with_hash("abc123");
        let second = record_with_hash("def456");
        engine.add_record(first).await;
        engine.add_record(second).await;

        let events = engine.snapshot_events(Some(1), Some(1)).await;

        assert_eq!(events.len(), 1);
        assert_eq!(events[0].sequence, 2);
    }
}
