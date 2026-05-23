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
push and manual `workflow_dispatch` runs. GitHub is currently blocking job
startup because the account has an Actions billing / spending-limit block. The
latest pushed run did not execute any project code; the check annotation says:

```text
The job was not started because recent account payments have failed or your
spending limit needs to be increased. Please check the 'Billing & plans'
section in your settings.
```

After billing is fixed:

```sh
gh workflow run public-ci.yml --repo Z5Jonathan-maker/dotfiles
```
