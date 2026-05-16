# Local Engine Security Spec

## Defaults

- Bind to 127.0.0.1 only.
- Require random per-launch auth token.
- Do not expose remote access by default.
- Do not log tokens.
- Reject requests without expected version header after API stabilizes.

## Remote dashboard later

Disabled by default. Requires explicit user enablement, password/token, warning copy, and safe network binding.
