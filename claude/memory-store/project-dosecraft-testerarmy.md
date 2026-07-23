---
name: project-dosecraft-testerarmy
description: "TesterArmy AI UI testing wired into DoseCraft mobile via .github/workflows/testerarmy-mobile.yml, plus the 2-project gotcha"
metadata:
  type: project
  originSessionId: a0055fe7-83b6-47bd-bef6-b023f8e5b826
---
DoseCraft mobile (Expo `apps/mobile`) has TesterArmy AI UI testing wired as of 2026-05-06.

**Workflow**: `.github/workflows/testerarmy-mobile.yml` on `Z5Jonathan-maker/dosecraft` (note: lowercase repo name now after a GitHub rename — old `Z5Jonathan-maker/DoseCraft` redirects).

**Pipeline**: ubuntu-latest runner → checkout → npm ci → expo+EAS setup → trigger EAS Cloud build (review-smoke profile, simulator) → poll for FINISHED → download .app via applicationArchiveUrl → tar -xzf → find .app → hand to `tester-army/mobile-github-action@v1`.

**Why EAS Cloud, not local macos**: tried local macos-15 + Xcode 16.1 pin first. Catch-22: Xcode 16.1 lacks iOS 18.1 SDK that the build needs (xcodebuild error); Xcode 16.2+ has the SDK but compiles in Swift 6 strict-concurrency mode that expo-modules-core (Expo SDK 55) wasn't authored against (~30 main-actor errors in SwiftUIVirtualView.swift). EAS Cloud handles their image pinning so SDK 55 builds work.

**Required GH secrets** (4): TESTERARMY_API_KEY, TESTERARMY_PROJECT_ID, TESTERARMY_WEBHOOK_URL, EXPO_TOKEN. Stored in 1Password vault Personal item TesterArmy when 1P CLI integration works (Settings → Developer → Connect with 1Password CLI). Secrets bootstrap helper: `~/DoseCraft/scripts/testerarmy-setup.sh`.

**Why:** App Store rejected v1.0.2 + v1.0.3 for Guideline 4 (Design — hard-to-read type on iPad). The "Apple App Store Launch Readiness - Core App Flow Verification" test in TesterArmy is exactly the pre-submission gut-check that should catch this on the next round before resubmit.

**How to apply:**
- **2-project gotcha**: account has TWO TesterArmy projects: `dose craft app` (id `f939581b-0b9b-4186-ae51-e76b69834328`) and `dose craft llc` (id `93476225-587d-4eb8-8e7d-904409e1964a`). The active webhook + Apple App Store Launch Readiness test live in **`dose craft llc`** (id `93476225-...`). PROJECT_ID env must point to `93476225-...` or the webhook trigger fails with `400 InvalidMobileApp: Selected mobile app was not found for this project`. Tests we add via API must also go to that project.
- **Build path**: do NOT switch to `--local` builds. Stays on EAS Cloud. macos-15 / Xcode pin only resurfaces if EAS becomes unavailable.
- **API base**: `https://tester.army/api/v1/...` (NOT `/v1/...` despite the OpenAPI spec saying `/v1/`; the production site only serves `/api/v1/`).
- **Webhook URL format**: `https://tester.army/api/v1/groups/webhook/{webhookId}/{secret}`. Webhook ID ≠ group ID. Secret in URL is the auth.
- **API key rotation**: API key was pasted in chat 2026-05-06; should be rotated post-validation. Old key starts `sk_2f7b...` (compromised), current `sk_625277...` (also pasted, also compromised — needs rotation when user has time).
- **Ghost run side effect**: probing the webhook URL with `curl -d '{}'` triggers a real test run via `test_default` mode. Don't probe needlessly.
- **Concurrency rule**: workflow has `cancel-in-progress: true` on `testerarmy-mobile-${{ github.ref }}` group — back-to-back triggers cancel earlier ones.
