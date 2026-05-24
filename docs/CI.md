# CI.md

`cc-public-ci-check` is the portable validation gate for public contributors.
It avoids private macOS services, Kimi state, VS Code user symlinks, and local
credentials.

Run it before opening a PR:

```sh
cc-public-ci-check
```

Expected result:

```text
passed=23 failed=0
```

## GitHub Actions Status

The workflow file exists at `.github/workflows/public-ci.yml` and supports both
push and manual `workflow_dispatch` runs.

The workflow currently runs on the default GitHub-hosted Ubuntu runner. The
latest hosted proof run is:

```text
https://github.com/Z5Jonathan-maker/ai-coding-os/actions/runs/26336821207
```

`runs-on` remains configurable through the repo variable `PUBLIC_CI_RUNNER`.
Leave that variable unset for GitHub-hosted Ubuntu. Set it to
`["self-hosted","macOS","ARM64"]` only when the maintainer-local
`imac-dotfiles` runner is intentionally used as a backup.

Trigger a run:

```sh
gh workflow run public-ci.yml --repo Z5Jonathan-maker/ai-coding-os
```

Check backup runner status:

```sh
gh api repos/Z5Jonathan-maker/ai-coding-os/actions/runners \
  --jq '.runners[] | {name,status,busy,labels:[.labels[].name]}'
```
