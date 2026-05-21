# Decisions Log

Use this file for major decisions made during development.

| Date       | Decision                               | Reason                                           | Revisit?                   |
| ---------- | -------------------------------------- | ------------------------------------------------ | -------------------------- |
| 2026-05-02 | Use sidecar engine boundary            | isolates native crashes and keeps Tauri UI safer | after native MVP           |
| 2026-05-02 | No built-in torrent search in MVP      | reduces legal/reputation risk                    | after legal review         |
| 2026-05-02 | Keep remote dashboard disabled for MVP | reduces attack surface                           | after auth/security design |
| 2026-05-02 | Use safe GitHub automation only        | no credential or permission bypass               | never                      |
