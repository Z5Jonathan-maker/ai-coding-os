# ROADMAP.md

This roadmap tracks the gap between the current release candidate and a
developer-grade public launch.

## v0.1.0 Final

- Keep `cc-release-check` green from a clean, synced tree.
- Replace deterministic cockpit media with real unlocked VS Code screenshots if
  macOS UI access is available.
- Raise local disk headroom from the 25GB minimum to the 50GB preferred target.
- Validate install on one fresh macOS Apple Silicon account.
- Publish GitHub release notes from `docs/RELEASE-NOTES-v0.1.0-rc7.md`.
- Keep `cc-public-ci-check` green in GitHub Actions for portable contributor
  validation.
- Keep `.github/workflows/public-ci.yml` runnable through the configurable
  `PUBLIC_CI_RUNNER` path. Done 2026-05-23: maintainer repo uses the
  `imac-dotfiles` self-hosted runner while GitHub-hosted billing is blocked.
- Attach the `cc-release-bundle` tarball and checksum to the public GitHub
  release. Done 2026-05-22 for `v0.1.0-rc7`.

## v0.2.0

- Make browser mode setup more automatic while keeping credentials out of repo
  and transcript.
- Add structured route history inside the cockpit.
- Add a public demo fixture repo so evaluators can test routing without using
  private projects. Done 2026-05-21: `fixtures/demo-project` and
  `cc-demo-fixture`.
- Split personal-machine checks from product checks where external users cannot
  reproduce local-only services.

## v1.0.0

- Support a clean bootstrap path for a new developer without Jonathan-specific
  accounts.
- Publish a stable cockpit extension install path.
- Document provider-cost profiles and fallback policy as product contracts.
- Expand CI coverage beyond portable structure checks into fixture-based router
  and cockpit tests.
