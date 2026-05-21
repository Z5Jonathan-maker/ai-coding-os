# SECURITY.md

## Supported Scope

Security reports should focus on:

- secret leakage in dotfiles, scripts, docs, or VS Code extension files
- credentialed actions bypassing TEL or documented approval gates
- destructive commands without explicit review
- browser automation misrepresenting its active mode or trust boundary
- package/install behavior that mutates user files outside documented paths

## Credential Policy

Never commit:

- API keys
- OAuth tokens
- browser cookies
- 1Password item values
- private customer data
- local `.env` files

Credentialed actions must go through TEL or explicit local setup. Browser
automation must state whether it is using `official-extension`, `shim`,
`playwright`, `locked-session`, or `not-ready`.

## Reporting

Open a GitHub security advisory if the repo is public and advisories are
enabled. Until then, report privately to the repository owner.

Include:

- affected file/command
- reproduction steps
- expected behavior
- actual behavior
- whether credentials or destructive actions are involved

## Non-Security Issues

Install drift, missing optional tools, and unsupported platform requests should
use the normal issue templates instead of security reporting.
