# Settings Persistence Implementation Spec

## Requirements
- Versioned settings schema.
- Atomic writes.
- Migration support.
- Reset-to-defaults.
- Export/import settings.
- Secrets never stored in plaintext unless OS keychain is not available and user explicitly accepts.

## Important settings
- default save path
- smart speed mode
- bandwidth profiles
- expert mode
- appearance
- reduce motion
- safety warnings
