# Add Torrent Implementation Spec

## Inputs

- Magnet URI.
- `.torrent` file path.
- Drag/drop file.
- Clipboard suggestion with user confirmation.

## Required validation

- Empty input rejection.
- Magnet URI syntax validation.
- `.torrent` extension and metadata parse validation.
- Save path validation.
- Duplicate info hash detection.

## UI states

- empty
- parsing
- fetching metadata
- metadata ready
- duplicate
- invalid
- ready to start

## Engine behavior

- For `.torrent`, parse metadata before add.
- For magnet, add pending metadata state.
- Never block UI while metadata is fetched.
- Emit structured events for metadata progress.
