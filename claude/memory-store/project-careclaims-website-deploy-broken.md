---
name: project-careclaims-website-deploy-broken
description: careclaimsadjusting.com Vercel deploy was broken ~74d (FIXED 2026-06-07); durable config notes
metadata: 
  node_type: memory
  type: project
  originSessionId: fe87d4ba-28a1-4e02-a027-8c854f208242
---

`careclaimsadjusting-website` (repo `Z5Jonathan-maker/careclaimsadjusting-website`) GitHub→Vercel pipeline was BROKEN ~74 days; **FIXED 2026-06-07**.

**Was broken:** live `careclaimsadjusting.com` served a stale cached Vercel build from `6a4985f` (2026-03-25); every commit since (premium WebGL UI, 100% Spanish /es/ parity, SEO/GEO schema enrichment) never reached prod. Root causes: GitHub integration was disconnected from the Vercel project AND the domain was not attached to the project.

**Fix that worked (Vercel CLI, scope `jonathan-cimadevillas-projects`):**
1. `vercel git connect --yes` in the project dir — relinked the project + reconnected the GitHub repo (created `.vercel/`, gitignored).
2. `vercel deploy --prod --yes` — created a production deployment; this auto-attached the domain to the project and aliased `careclaimsadjusting.com` to it.
3. Verified future pushes auto-deploy (a `git push origin main` then triggered a fresh Production deployment within ~11s).

**Durable config (do not break):**
- Deploy serves `public/` statically. `vercel.json` now has `framework:null`, `buildCommand:""`, `installCommand:""`, `outputDirectory:"public"` — this is CRITICAL: it stops Vercel auto-detecting Eleventy (`@11ty/eleventy` is in package.json) and running a build that would regenerate `public/` from the INCOMPLETE `src/` (~1 page) and clobber the 141 hand-authored pages. NEVER remove that, and NEVER run `eleventy build` locally then commit `public/`.
- Domain DNS = Google Cloud (`ns-cloud-d*`), apex served by Vercel; `eden.careclaimsadjusting.com` is a separate `eden2` project (leave alone). Standard deployment protection is ON = `*.vercel.app` URLs return 401 by design, but the custom domain is public — that 401 is NOT a problem.
- Verify any "is it live" claim with `cc-deploy-watch Z5Jonathan-maker/careclaimsadjusting-website careclaimsadjusting.com`. Mirrors [[project-claimpilot-deploy-reality]].

**Project CLAUDE.md is stale:** says dark/gold theme + Eden platform + Squarespace DNS. Live reality = blue `#0170B9` + gold `#C8A456` + orange `#F38229` palette, platform rebranded Eden→ClaimPilot (residual "EDEN" leftovers still on careers.html/contractors.html), DNS at Google. AI-visibility layer (Speakable on 139 pages, llms-full.txt 306-Q&A corpus, ai.summary backfill) shipped 2026-06-07.
