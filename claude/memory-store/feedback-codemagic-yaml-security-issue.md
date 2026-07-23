---
name: feedback-codemagic-yaml-security-issue
description: "Active credential leak (base64-encoded private key inline) and dead workflow at ~/DoseCraft/codemagic.yaml; needs rotation + cleanup"
metadata:
  type: feedback
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
`~/DoseCraft/codemagic.yaml` has TWO problems flagged 2026-05-06 but not yet resolved:

1. **Active credential leak**: lines 26-30 contain a base64-encoded App Store Connect `.p8` private key inline in a shell script (`echo "LS0tLS1CRUdJTi..." | base64 --decode > /tmp/asc_key.p8`), plus the `KEY_IDENTIFIER=3D3ZJ67X8L` and `ISSUER_ID=4c70f90b-70d1-4c6f-b01f-78421f558109`. Whether the repo is currently public or private, the key is in git history and visible to anyone with repo read.

2. **Stale references**: `working_directory: apps/native-ios` — that directory does not exist in the repo. The actual iOS build path is `apps/mobile` (Expo + EAS). The codemagic workflow refers to a Capacitor build that's been removed.

**Why:** User flagged interest in fixing iOS CI; the leak was spotted incidentally during TesterArmy wiring. Apple App Store Connect API keys grant full submission access — a leaked key can publish or pull binaries on behalf of the team.

**How to apply:**
- Mention the rotation when it comes up; don't unilaterally fix without explicit ask.
- Rotation procedure: appstoreconnect.apple.com → Users and Access → Integrations → App Store Connect API → revoke `3D3ZJ67X8L` → generate new key → store in Codemagic encrypted env (or 1Password and have codemagic.yaml fetch via codemagic CLI).
- Stale-reference cleanup: either delete `codemagic.yaml` entirely (codemagic isn't actively used — DoseCraft mobile builds via EAS), OR repoint to `apps/mobile` if there's a real Capacitor app being maintained.
- Do NOT echo or paste the key text back to user; reference by KEY_IDENTIFIER only.
