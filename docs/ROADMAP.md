# ROADMAP.md

This roadmap tracks the gap between the current release candidate and a
developer-grade public launch.

## v0.1.0 Final

- Keep `cc-release-check` green from a clean, synced tree.
- Replace deterministic cockpit media with real unlocked VS Code screenshots if
  macOS UI access is available.
- Raise local disk headroom from the 25GB minimum to the 50GB preferred target.
- Validate install on one fresh macOS Apple Silicon account.
- Publish GitHub release notes from `docs/RELEASE-NOTES.md`.
- Keep `cc-public-ci-check` green in GitHub Actions for portable contributor
  validation.
- Keep `cc-benchmark-fixtures --check` green across 10 public scenarios. Done
  2026-05-23: code fix, extraction, UI design, browser proof, security review,
  long context, refactor, failing test repair, image-to-UI handoff, and
  permission denial.
- Keep `.github/workflows/ci.yml` runnable through the configurable
  `PUBLIC_CI_RUNNER` path. Done 2026-05-23: hosted Ubuntu is the primary path,
  with `imac-dotfiles` retained as backup.
- Attach the `cc-release-bundle` tarball and checksum to the public GitHub
  release. Done 2026-05-22 for `v0.1.0-rc7`.
- Capture sustained local dogfood evidence through runnable fixtures, not dated
  report files. Historical dated dogfood reports were removed from the product
  docs during the cleanup pass.

## v0.2.0

- Make browser mode setup more automatic while keeping credentials out of repo
  and transcript.
- Add structured route history inside the cockpit.
- Add a public demo fixture repo so evaluators can test routing without using
  private projects. Done 2026-05-21: `fixtures/demo-project` and
  `cc-demo-fixture`.
- Split personal-machine checks from product checks where external users cannot
  reproduce local-only services.
- Add a mutating multi-hour coding dogfood that includes real edits, at least
  one failure/recovery path, review, and merge proof.
- Add a larger public-repo mutating dogfood with failing CI, repair, review,
  and merge-ready diff. Keep the workflow as a runnable fixture instead of a
  dated report.
- Add a third-party public-repo dogfood. Keep the workflow as a runnable fixture
  instead of a dated report.

## v1.0.0

- Support a clean bootstrap path for a new developer without maintainer-specific
  accounts.
- Publish a stable cockpit extension install path.
- Document provider-cost profiles and fallback policy as product contracts.
- Expand CI coverage beyond portable structure checks into fixture-based router
  and cockpit tests.
