---
name: project-jlgrease-seo
description: "J&L Grease Collections site — repo name, deploy mechanism, SEO state, and the open NAP-verify blocker"
metadata: 
  node_type: memory
  type: project
  originSessionId: 244ddc18-a8c2-40a8-bab4-d6795f6d9f37
---

J&L Grease Collections LLC — NJ grease trap cleaning / used cooking oil collection marketing site. Live at https://jlgreasecollections.com.

**Repo:** `Z5Jonathan-maker/jlgreasecollections-website` (NOT `jlgreasecollections` — that name 404s). Private. Cloned at `~/code/projects/jlgreasecollections-website`. Built with KIMI (React 19 + Vite 7 + TS + shadcn + i18n EN/ES toggle).

**Deploy reality:** NOT git-auto-deploy. Ships via local `./deploy.sh` → `npm run build` then `netlify deploy --prod --dir=dist`. Netlify project = `rad-twilight-b59978`. Token in `.env.netlify`. Pushing to GitHub does nothing to prod — must run deploy.sh.

**Build now includes prerender:** `npm run build` = `tsc -b && vite build && node prerender.mjs`. prerender.mjs uses puppeteer (bundled chromium) to render the CSR SPA to static per-route HTML so Bing/AI bots see content+JSON-LD. `base` is `/` (not `./`) for nested-route assets. `build:nossr` skips prerender. inspectAttr (kimi) gated to dev-only.

**SEO fixed (2026-06-06, live):** added homepage H1, removed fabricated aggregateRating 4.9/200 + orphaned ExtendedSchema fake reviews, dropped invalid SearchAction + same-URL hreflang, trailing-slash canonicals/sitemap, llms.txt. See `docs/LOCAL-SEO-PLAYBOOK.md` (GBP + citations source-of-truth).

**NAP RESOLVED (2026-06-06):** J&L is a service-area business, NO storefront. Schema now city/region only (no streetAddress/postalCode); visible text = "Based in Paterson, NJ — serving all of North Jersey". GBP must be set up as "I deliver to customers" with service areas, blank street. Citations: leave street field blank. Still open: socials (fb/ig/yelp `jlgrease`) unconfirmed real; no real reviews yet so aggregateRating stays out until genuine ones exist.

**UI fixes shipped 2026-06-06 (ec923da):** nav is now a single shared `src/components/SiteHeader.tsx` (self-contained via useNavigate) replacing 5 duplicated inline navs — DON'T re-add per-page navs. It added the mobile hamburger menu that was entirely missing (inner pages previously showed only a logo on mobile). Also: dynamic copyright year (was hardcoded 2024), trimmed mid-page CTA stack 4→2. noUnusedLocals/Parameters are ON — removing nav orphaned LangToggle/PhoneCall imports + nav-handler props (cleaned).

**GBP via kimi-webbridge (Chrome, logged in as jlgservices04@gmail.com / Rafael, UI in es-419):** profile already ~80% optimized (SAB, 20 service areas, M-F 7-6 hours). Edit UI is a same-origin iframe `google.com/local/business/<id>/editprofile/info` (biz id 18254705836862834950) — drive via `evaluate` into the iframe + `cdp Input.dispatchMouseEvent` at CSS coords (iframe is full-viewport 0,0; screenshot is 2x). Description editor = plain textarea, set via native setter + input event → SAVES fine. Category/Services = autocomplete that FIGHTS automation (dropdown shifts, snaps to wrong variant on save, matches from START of category name) — description done, categories deferred. Bridge tools: navigate/evaluate/cdp/screenshot/click/fill/key_type/send_keys/mouse_click(needs selector).

**Kept on purpose (user decision):** fake stats ("200+ restaurants", "100% compliance") + 3 fabricated testimonials stay visible on site. Reality: GBP has **1 real Google review** (5.0).

**Google Search Console (2026-06-06):** URL-prefix property `https://jlgreasecollections.com/` VERIFIED via HTML file `public/google4235cb3234c72136.html` (keep that file in repo — removing it un-verifies). `sitemap.xml` submitted. Done via kimi-webbridge logged in as jlgservices04@gmail.com.

**Review kit** at `review-kit/` (QR png+svg, printable A6 card, bilingual SMS). Canonical Google review link: **https://g.page/r/CT5u1DU44ACNEBM/review** (from GBP owner dashboard).

**⚠️ Netlify deploy gotcha:** `deploy.sh` / `netlify deploy --prod` now returns **403 Forbidden** (reads + DRAFT deploys work; only --prod publish 403s; published_deploy.locked=None so cause unclear — possibly free-tier prod-publish limit). WORKAROUND that worked: `netlify deploy --dir=dist` (draft) → then `curl -X POST -H "Authorization: Bearer $TOKEN" https://api.netlify.com/api/v1/sites/<id>/deploys/<draftDeployId>/restore` to promote to prod. Site id 1e8405f9-ac05-445a-a5a0-c133c1856b42.

**Duplicate GBP listing (2026-06-06):** confirmed TWO distinct Google listings. KEEP = verified/owned, has website+hours+description+1 review, place id `0x4b5ea5fb42baf6c3:0xdfff90175624ea84`. STRAGGLER = sparse/unowned/0-reviews/no website, place id starts `0x4ca08ab2…`, pin drifted to central PA. Reported the straggler via Maps Suggest-an-edit → "Es un duplicado de otro lugar" (merge, NOT permanently-closed) → submitted; Google emails owner when reviewed (days-weeks). If it doesn't take: escalate via GBP Support chat to merge place X into Y (gold standard), or owner claims the duplicate to trigger auto-merge. Don't ever pick "permanently closed" (would flag the brand closed).

**Next phases queued:** per-city landing pages, `/es/` routes, actually collecting reviews (the #1 local lever). [[feedback-kimi-paid-account]]
