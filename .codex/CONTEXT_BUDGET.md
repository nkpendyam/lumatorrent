# Context Budget Rules

Codex must protect context aggressively.

## Before scanning

Ask: what exact files are relevant?

Preferred order:

1. Read index files and manifests.
2. Search symbols.
3. Open only target files.
4. Avoid broad full-repo reading.

## Ignore directories

Never inspect unless required:

- node_modules
- target
- dist
- build
- .git
- coverage
- screenshots/generated
- release artifacts

## Output budget

Keep session updates compact.

- Long reasoning belongs in docs only when it is durable.
- Do not paste huge files into chat.
- Summarize diffs by file and purpose.

## Model budget

- Cheap model: discovery, repetitive edits, docs cleanup.
- Strong model: architecture, security, native integration, hard bugs.
