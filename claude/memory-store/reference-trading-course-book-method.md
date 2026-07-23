---
name: reference-trading-course-book-method
description: "Industry-standard method for building trading education books/guides/courses (pedagogy + chart fidelity + setup docs), researched 2026-06-28"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 2371a7ee-9ee2-4e08-89fc-b6ddec492160
---

Industry-leading way to build a trading education book/course (web-researched 2026-06-28, citation-rigorous). Applied to the MYM six-strategies manual (`mym-autotrader/docs/THE-SIX-STRATEGIES.html`).

**Pedagogy** (CMT scaffold + Cognitive Load Theory worked-example effect + Merrill): three-tier structure Foundation → Strategies → Integration (risk/psychology/sim are Tier-3, NOT footnotes per strategy). Each strategy module: open with a real scenario → state learning objectives ("you will be able to…") → if-then rule table → ≥3 annotated worked examples then FADED then blank exercise → pre-trade checklist → common-mistakes (Mistake|Why|Fix, placed at END) → knowledge check. Add: "How to study" orientation, syllabus in learner language, competency rubric (Novice/Developing/Proficient/Mastery), standalone sim plan, master review (all strategies side-by-side), review anchors, glossary up front. 4 callout types: RULE/EXAMPLE/WARNING/PRACTICE.

**Chart fidelity** (Nison hybrid = the standard): clean SCHEMATIC (idealized geometry) FIRST, then REAL annotated chart screenshots (proof on live data) — use BOTH. Sparse annotation (5–7 marks: entry/stop/target lines + 1 zone rect + labels). Price HIGH-ON-TOP, honest scale, real candle anatomy (label O/H/L/C, body>wick). Never rely on color alone (pair with arrows+labels) — red/green fails ~8% deuteranopia; colorblind-safe = blue #0072B2 / orange #E69F00. SVG vector for schematics (crisp/print), light background for print (dark prints as mud), convert text→paths for PDF. Real screenshots: TradingView web, indicators active, sparse marks, before/after pairs.

**Setup docs** (official TV/NT8 + Atlassian): prereqs → numbered steps (one action each) → settings table (Param|Value|What) → expected-result confirmations → troubleshooting → version note. TradingView: symbol+30m → Pine Editor tab → Create new/Indicator → paste → ⌘S → Add to chart; settings via gear → Inputs tab; input.bool = checkboxes. NT8: Control Center → Tools▸Import▸NinjaScript .zip → F5 compile → chart Strategies (Ctrl+S) → Enabled=True. Replicate-my-chart: TV indicator templates (saveable) / layout link (view-only); NT8 chart templates + workspaces.

Sources incl. cmtassociation.org, tll.mit.edu (worked examples), archive.org Nison, rgblind.com (palette), official tradingview.com + ninjatrader.com help. Related: [[project-mym-mtf-gate-golden-standard]].
