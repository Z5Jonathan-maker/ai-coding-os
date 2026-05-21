# CONTRIBUTING.md

This project is an AI coding operating system: VS Code cockpit, deterministic
router, model/tool lanes, receipts, permissions, and rebuildable macOS config.

## Quality Bar

Every contribution must make the system more capable, safer, cheaper, clearer,
or easier to rebuild. If it does not pass one of those tests, it does not belong
in the active stack.

## Before Opening A PR

Run:

```sh
~/dotfiles/install.sh --dry-run
cc-product-readiness
cc-demo-five-minute --no-package
cc-package-cockpit
git status --short
```

Expected:

- first-run doctor exits successfully
- product readiness is `14/14`
- demo exits successfully from a clean tree
- cockpit package command produces a VSIX
- repo is clean except intentional work

## Contribution Boundaries

- Do not add a new AI lane unless it has a distinct capability, cost, trust
  boundary, or fallback role.
- Do not add duplicate IDE shells or chat wrappers.
- Do not add secrets, API keys, tokens, or personal account data.
- Do not hide unsupported states. Name the mode or blocker directly.
- Do not import reference-project code unless it passes
  `docs/CODE-HARVEST-WORKFLOW.md`.

## Preferred Change Shape

- Small command or cockpit surface first.
- Documentation update in the same PR when behavior changes.
- Verification command in the PR description.
- No broad rewrites unless the architecture map says the area is owned by the
  change.

## Commit Style

Use short imperative commits:

```text
Add first-run doctor
Report browser proof mode
Show first-run state in cockpit
```

## Security

Credentialed actions belong behind TEL or documented local setup. Browser
automation must name its active mode: `official-extension`, `shim`,
`playwright`, `locked-session`, or `not-ready`.
