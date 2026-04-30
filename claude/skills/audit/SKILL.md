---
name: audit
description: Deep-version of /onboard's audit-light pass. Runs against an existing repo and produces a prioritized punch list across performance, accessibility, SEO, security, dep hygiene, dead code, framework drift, DESIGN.md compliance, and CI presence. Use when the user says "/audit", "audit this repo", "what's broken here", "give me a punch list", "score this project". Composes with cloud Routines (/route → /schedule) for weekly automated audits on shipped projects (Iglesia, barber, etc).
---

# /audit — production-grade rehab assessment

Pair with `/onboard`. /onboard scaffolds the docs; /audit produces the
punch list of what to FIX, prioritized.

## What it runs

### 1. Performance + a11y + SEO (via chrome-devtools MCP)

```
mcp__chrome-devtools__navigate_page <local-dev-url-or-deployed-url>
mcp__chrome-devtools__lighthouse_audit
```

Capture per-category scores: Performance, Accessibility, Best Practices,
SEO. Note categories <90.

For dynamic sites, also run:
- Mobile viewport (375x812) lighthouse
- Desktop (1440x900) lighthouse
- Slow-3G throttle for performance reality check

### 2. Dependency audit

```bash
npm audit --json 2>/dev/null | jq '.metadata.vulnerabilities'
npm outdated --json 2>/dev/null | jq 'to_entries[] | select(.value.current != .value.latest) | {name:.key, current:.value.current, latest:.value.latest, type:.value.type}' | head -20
```

For Python: `uv pip check`, `pip list --outdated`.
For Rust: `cargo outdated`.
For Go: `go list -u -m all`.

### 3. Framework + version drift

Check for:
- Mixed Next.js routers (App + Pages both used) — Next-specific footgun
- React 18 + 19 mixed (peer dep mismatch)
- Tailwind v3 + v4 in same repo
- Old node version in `package.json` engines vs what's installed
- TypeScript strict mode off when it should be on

### 4. Dead code / unused

```bash
# Unused exports (TS)
npx ts-prune 2>/dev/null | head -30
# Unused deps
npx depcheck --json 2>/dev/null | jq '{unused:.dependencies, missing:.missing|keys}'
# Files imported by nothing
git ls-files '*.ts' '*.tsx' '*.js' '*.jsx' | while read f; do
  base=$(basename "$f" | sed 's/\.[^.]*$//')
  refs=$(git grep -l "$base" -- '*.ts' '*.tsx' '*.js' '*.jsx' | grep -v "^$f$" | head -1)
  [ -z "$refs" ] && echo "ORPHAN $f"
done | head
```

### 5. Bundle size

```bash
[ -d .next ] && du -sh .next/static/chunks/*.js 2>/dev/null | sort -rh | head -10
# Or if using @next/bundle-analyzer:
ANALYZE=true npm run build 2>&1 | tail -20
```

Flag any first-load JS > 300KB.

### 6. Secret scan

```bash
# detect-secrets is in user's pre-commit; run standalone:
detect-secrets scan --baseline .secrets.baseline 2>/dev/null
# Plus a quick sanity grep for common patterns
git grep -nE 'sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|AKIA[0-9A-Z]{16}' \
  -- ':!*.lock' ':!node_modules' 2>/dev/null | head
```

### 7. CI / deploy hygiene

- `.github/workflows/` present + at least one job?
- Vercel project linked (`.vercel/project.json` or `vercel.json`)?
- `.env.example` present with all keys actual `.env` uses?
- `next.config.*` has output, image domains, security headers?

### 8. Doc compliance (the user's own standards)

- CLAUDE.md present (project-specialist instance)?
- AGENTS.md present (cc-swarm personas)?
- DESIGN.md present (visual identity)?
- SESSION-HANDOFF.md present + recent (<14d)?
- ARCHITECTURE.md present (if shape is CRM/e-commerce/SaaS/API)?
- README.md non-default (not the create-next-app template)?

### 9. DESIGN.md drift

Compare DESIGN.md tokens to actual code:
- Color tokens vs `tailwind.config.*` palette
- Font stack in DESIGN.md vs actual `next/font` imports
- Spacing scale vs Tailwind config
- Motion easing vs actual GSAP/Framer-Motion timings

Flag drift > 20%.

### 10. Project-shape-specific checks

- **Marketing site:** lighthouse Performance >= 95? FCP < 1.8s? CLS < 0.05?
- **CRM / SaaS:** error boundary at root? loading.tsx + error.tsx in app dir? auth wraps server actions?
- **E-commerce:** Stripe webhook signature verified? idempotency keys on purchase actions? cart-state hydration race?
- **Mobile (Expo):** EAS build profile per env? Sentry / crashlytics wired? deep link config?

## Output format

A single markdown punch list, prioritized:

```markdown
# /audit — <project> — <date>

## 🔴 Critical (fix before next deploy)
- [ ] <issue>: <one-line fix>
- [ ] <issue>: <one-line fix>

## 🟡 High (fix this week)
- [ ] <issue>: <one-line fix>

## 🟢 Medium (next sprint)
- [ ] <issue>

## 📊 Scores
| Category | Score | Threshold |
|---|---|---|
| Lighthouse Performance | 87 | 95 |
| Lighthouse Accessibility | 92 | 95 |
| ...

## 🧹 Hygiene
- Outdated deps: 12
- Dead code files: 3
- Missing docs: AGENTS.md, ARCHITECTURE.md
- DESIGN.md drift: 35%
```

Save to `./audits/<YYYY-MM-DD>.md` so successive audits form a quality
timeline. Compare to previous audit if one exists; flag regressions.

## Composition with the rest of the stack

| Skill / pattern | How /audit composes |
|---|---|
| `/onboard` | /onboard runs audit-light inline; /audit is the deep version on demand |
| `/route` | Route weekly audit runs to cloud Routines for shipped projects (Iglesia, barber) |
| `mercury` / `cc-loop` | Dispatch the punch list as a multi-day task: "fix every Critical, one PR per item" |
| `session-handover` | Audit punch list becomes the SESSION-HANDOFF.md "Open threads" section |
| `Langfuse` | Audit traces show in Langfuse — score per audit run is feedback for future iterations |
| `ntfy-notify` | Phone push when an audit finishes with new Critical items |

## When to run

- After `/onboard` on a freshly-onboarded project
- Before a deploy to production
- Weekly via cloud Routine for shipped projects in maintenance mode
- After a "feels broken" intuition — let the audit name what's actually wrong
- Before pitching a redesign / engagement (the audit IS the proposal evidence)

## Honesty constraints

- Lighthouse runs vary 5-10 points run-to-run. Run 3 times, report median.
- Some "outdated deps" are intentional (locked to a major). Surface, don't auto-flag.
- Dead-code detection has false positives (dynamic imports, registries). Verify before recommending deletion.
- Don't recommend dep upgrades that would touch a major version without flagging breaking changes.
- If a project has no DESIGN.md, skip the drift check rather than scoring it 0/10.
