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
passed=8 failed=0
```

## GitHub Actions Status

The workflow file exists at `.github/workflows/public-ci.yml`, but the workflow
is currently disabled in GitHub because the account has an Actions billing /
spending-limit block. The first pushed run did not execute any project code; it
failed before job startup with a billing-plan annotation.

After billing is fixed:

```sh
gh workflow enable public-ci.yml --repo Z5Jonathan-maker/dotfiles
gh workflow run public-ci.yml --repo Z5Jonathan-maker/dotfiles
```
