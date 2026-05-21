# ISA — Sellable Open Source AI Coding System

**Generated:** 2026-05-21 20:27
**Owner:** Codex
**Scope:** Make the current AI coding operating system ready to be studied, installed, demoed, and adopted by serious developers within four weeks.

## Vision (1-3 sentences)

The system is a clean, installable, impressive AI coding operating system with a native VS Code cockpit, deterministic multi-model routing, visible cost/control surfaces, and a five-minute demo that proves why it is better than single-model IDE assistants. A strong developer can clone it, understand it, run it, verify it, and see the product idea without needing Jonathan's personal machine context.

## Ideal State Criteria (ISCs)

| ID | Criterion | Verification | Status |
|---|---|---|---|
| ISC-1 | The public README explains the product promise, target user, architecture, install path, demo, and support boundaries. | Read `README.md`; all six sections are present and specific. | in-progress |
| ISC-2 | A fresh-install path exists that reports missing prerequisites without failing opaquely. | Run `~/dotfiles/install.sh --dry-run` or documented equivalent; output lists missing keys/apps/tools. | pending |
| ISC-3 | Product readiness passes on the development machine. | `cc-product-readiness` returns `13/13` and `Status: product-ready`. | verified |
| ISC-4 | The VS Code cockpit can be packaged and installed as a distributable VSIX. | `cc-package-cockpit` creates `dist/ai-system-cockpit-*.vsix`. | verified |
| ISC-5 | The five-minute demo proves route, cockpit, browser proof, repo context, diff review, and verification. | `cc-demo-five-minute` exits 0 and produces readable proof with no blockers. | verified |
| ISC-6 | The router exposes deterministic receipts for lane, model, fallback, latency, and cost/token status. | `cc-router-receipt` and `cc-router-metrics` show current routed session and no unknown fields. | pending |
| ISC-7 | Browser automation has an honest primary/fallback story. | `cc-kimi-status` and `cc-browser-proof` distinguish official extension, shim, Playwright fallback, and locked-session limits. | verified |
| ISC-8 | The repo has no obvious internal-only naming or undocumented personal assumptions in the first-run path. | `rg` audit over README/docs/bin/install surfaces no unexplained Jonathan-only blocker in public path. | pending |
| ISC-9 | The product has a week-by-week public launch plan with weekly ship gates. | `docs/FOUR-WEEK-PRODUCT-MASTER-PLAN.md` exists and maps weeks to artifacts and commands. | verified |
| ISC-10 | The final package has a credible open-source launch surface. | README, demo script, screenshots/GIF plan, license boundary, contribution notes, and release checklist exist. | pending |

## Anti-goals

- Do not add another IDE, model lane, or duplicate assistant shell.
- Do not market this as autonomous magic that bypasses OS/browser security.
- Do not import large reference projects unless they fill a named architecture gap.
- Do not hide missing API keys, paid subscriptions, or local app assumptions.
- Do not optimize for hype at the expense of install reliability.

## Out-of-scope (deferred)

- Hosted SaaS billing and team accounts.
- Windows/Linux parity beyond documented future support.
- Marketplace publishing beyond a local VSIX unless the package is stable.
- Enterprise MDM deployment automation.

## Constraints

- No secrets in git.
- Every shipped feature must improve capability, safety, cost, clarity, or rebuildability.
- VS Code remains the cockpit; the router remains the engine.
- Kimi/Playwright/browser limits must be documented honestly.
- Paid or credentialed actions stay behind TEL or explicit setup.
- Weekly gates must be command-verifiable.

## Stakeholders / approvers

Default approver: Jonathan Cimadevilla. Codex may mark criteria `verified` when commands pass, but final `signed-off` belongs to Jonathan.
