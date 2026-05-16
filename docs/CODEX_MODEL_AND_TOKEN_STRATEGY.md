# Codex Model and Token Strategy

This repo is optimized for ChatGPT Plus / Codex usage where model usage should be conserved.

## Required session instruction

```text
Use the cheapest capable model for each subtask.
Use gpt-5.4-mini for repo scanning, file discovery, and simple edits.
Use gpt-5.5 only for architecture, complex implementation, debugging, and final review.
Do not waste gpt-5.5 on repetitive scanning.
```

## Practical rules

- Use cheap/fast model for repo scanning and mechanical edits.
- Use strongest model for architecture, native engine, security, packaging, and final review.
- Reuse summaries instead of re-reading unchanged files.
- Keep context small: pass file paths, diffs, and failing logs instead of entire repo dumps.
- Use scripts to gather facts before asking the model.

## Model availability

Model IDs can vary. Codex must verify available models in the active environment. If the user-preferred model names are not available, follow the same routing principle with the closest available models:

- cheap/fast for scanning/simple edits
- strongest for complex reasoning/final review

## Approval policy

For safety, use an approval policy that asks before commands that modify system state outside the repo, install system packages, or use network access.

## v6 additions

Use `.codex/config.example.toml` as the template for repo-specific Codex configuration.

Recommended task routing:

| Task                      | Model class                                      | Notes                                        |
| ------------------------- | ------------------------------------------------ | -------------------------------------------- |
| Repo scan                 | cheapest capable                                 | Do not use strong model for broad discovery. |
| Simple docs edits         | cheapest capable                                 | Keep edits targeted.                         |
| UI component polish       | cheapest capable first, strong for design review | Use screenshots and visual specs.            |
| Native engine integration | strongest                                        | Requires systems reasoning.                  |
| Packaging/signing         | strongest                                        | High platform risk.                          |
| Security review           | strongest                                        | Look for data-loss and remote access bugs.   |
| Final review              | strongest                                        | Use review-only workflow.                    |

If the requested model names are not available, map them to the closest available fast model and strongest model, then document that mapping before continuing.
