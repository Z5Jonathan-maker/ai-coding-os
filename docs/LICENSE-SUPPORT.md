# LICENSE-SUPPORT.md

This is the launch boundary draft. It is not a legal opinion.

## Current State

The repository uses Apache-2.0. The VS Code cockpit package declares
`Apache-2.0` to match the root license.

## Recommended Launch Options

| Option | Fit | Tradeoff |
|---|---|---|
| MIT | Best for adoption, forks, and GitHub trend potential | Weakest control over commercial reuse |
| Apache-2.0 | Selected. Good for serious developer adoption with patent language | Slightly more formal |
| Source-available custom | Best if the system remains proprietary/sellable first | Not truly open source; lower GitHub adoption |

## Practical Recommendation

Keep private credentials, paid account setup, proprietary workflows, and
customer-specific automations out of the repo. Sell support, onboarding,
packaged workflows, hosted/team features, or done-for-you configuration.

## Support Boundary

Supported:

- macOS Apple Silicon
- VS Code cockpit
- local dotfiles install path
- documented AI lane commands
- setup doctor and product readiness gates

Best effort:

- non-Apple-Silicon macOS
- alternate VS Code distributions
- unofficial browser automation modes
- optional native app integrations

Not supported in the public repo:

- user API keys
- paid account provisioning
- bypassing OS/browser security approval
- production credentialed actions without TEL policy
- Windows/Linux parity unless explicitly added later

## Launch Requirement

Before public release:

1. add final screenshots/GIFs
2. verify root license and cockpit package license still match
3. verify security policy and issue templates render on GitHub
4. verify no private paths/secrets appear in launch docs
