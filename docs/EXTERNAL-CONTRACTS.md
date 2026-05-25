# External Contracts

Maintainer mode shells out to live tools that are intentionally outside the
portable repo. Treat those seams like APIs.

`cc-external-contracts` verifies:

- `router-ask` is present.
- `router-ask --dry-run --json` emits a parseable receipt with `purpose`,
  `prompt_chars`, `final_class`, `platform`, and `fallback_chain`.
- `router-ask --health` reports bridge health.
- `router-ask --list-tiers` exposes `cheap`, `codex`, `design`, `image`, and
  `precision`.
- `deepseek --help` still exposes `--json` and `--ping`.
- `kimi` is present.
- TEL client is executable.

This does not run a paid model call. It checks shape and availability so handoff
failures can be separated into routing drift, provider drift, or mission logic.
