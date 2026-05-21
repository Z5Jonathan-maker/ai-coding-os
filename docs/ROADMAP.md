# ROADMAP.md

This roadmap tracks the gap between the current release candidate and a
developer-grade public launch.

## v0.1.0 Final

- Keep `cc-release-check` green from a clean, synced tree.
- Replace deterministic cockpit media with real unlocked VS Code screenshots if
  macOS UI access is available.
- Raise local disk headroom from the 25GB minimum to the 50GB preferred target.
- Validate install on one fresh macOS Apple Silicon account.
- Publish GitHub release notes from `docs/RELEASE-NOTES-v0.1.0-rc1.md`.
- Keep `cc-public-ci-check` green in GitHub Actions for portable contributor
  validation.

## v0.2.0

- Make browser mode setup more automatic while keeping credentials out of repo
  and transcript.
- Add structured route history inside the cockpit.
- Add a public demo fixture repo so evaluators can test routing without using
  private projects.
- Split personal-machine checks from product checks where external users cannot
  reproduce local-only services.

## v1.0.0

- Support a clean bootstrap path for a new developer without Jonathan-specific
  accounts.
- Publish a stable cockpit extension install path.
- Document provider-cost profiles and fallback policy as product contracts.
- Expand CI coverage beyond portable structure checks into fixture-based router
  and cockpit tests.
