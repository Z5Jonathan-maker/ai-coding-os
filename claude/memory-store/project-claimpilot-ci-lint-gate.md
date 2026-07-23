---
name: project-claimpilot-ci-lint-gate
description: ClaimPilot CI blocks deploy on ruff E9/F63/F7/F82 — run it locally before pushing backend changes
metadata: 
  node_type: memory
  type: project
  originSessionId: 01f58f71-11e4-4a96-9873-14afda337feb
---

ClaimPilot's GitHub CI ("ClaimPilot CI/CD") has a hard **ruff lint gate** on the backend:
`ruff check --select=E9,F63,F7,F82` (syntax + undefined-name/F821, etc.). A failure here is
fatal and **blocks the Render deploy** — the push lands on `main` but prod never updates.

**Why:** `python -m py_compile` does NOT catch undefined names (F821) — they're runtime
NameErrors, not syntax errors. On 2026-06-05 a single bare `logger.warning` (the module uses
`logging.getLogger("weather")` inline, has no module-level `logger`) passed py_compile but
failed the CI F821 gate, silently blocking THREE consecutive deploys (Storm Events,
county-match, map). Symptom: live API missing the new fields despite green-looking pushes.

**How to apply:** before pushing backend changes, run the exact gate locally:
`uvx ruff check --select=E9,F63,F7,F82 backend/routes/...py backend/services/...py`
(the project venv at ~/code/ClaimPilot-scraper/.venv has no pip/ruff; use `uvx ruff`).
After any backend push, confirm deploy actually landed — `gh run list --limit 1` must show
`completed success`, then verify a new field is live, not just that the push succeeded.
Relates to [[project-claimpilot-deploy-reality]].
