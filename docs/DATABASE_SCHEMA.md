# Database Schema Draft

Use SQLite for local state. Do not store sensitive secrets in plain text.

## torrents

```sql
CREATE TABLE torrents (
  id TEXT PRIMARY KEY,
  info_hash TEXT UNIQUE,
  name TEXT NOT NULL,
  save_path TEXT NOT NULL,
  status TEXT NOT NULL,
  added_at TEXT NOT NULL,
  completed_at TEXT,
  total_bytes INTEGER NOT NULL DEFAULT 0,
  downloaded_bytes INTEGER NOT NULL DEFAULT 0,
  uploaded_bytes INTEGER NOT NULL DEFAULT 0,
  is_private INTEGER NOT NULL DEFAULT 0
);
```

## settings

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## diagnostics_events

```sql
CREATE TABLE diagnostics_events (
  id TEXT PRIMARY KEY,
  torrent_id TEXT,
  code TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

## migrations

Use forward-only migrations. Never silently reset user state.
