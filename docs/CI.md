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
passed=10 failed=0
```

## GitHub Actions Status

The workflow file exists at `.github/workflows/public-ci.yml` and supports both
push and manual `workflow_dispatch` runs.

The workflow defaults to GitHub-hosted Ubuntu runners, but `runs-on` is
configurable through the repo variable `PUBLIC_CI_RUNNER`. On this maintainer
repo, the variable is set to:

```json
["self-hosted","macOS","ARM64"]
```

That keeps CI available when GitHub-hosted private-repo minutes are blocked by
account billing or spending limits. The local runner is registered as
`imac-dotfiles`.

Trigger a run:

```sh
gh workflow run public-ci.yml --repo Z5Jonathan-maker/dotfiles
```

Check runner status:

```sh
gh api repos/Z5Jonathan-maker/dotfiles/actions/runners \
  --jq '.runners[] | {name,status,busy,labels:[.labels[].name]}'
```
