---
pattern: RUO peptide editorial-tier landing page
shipped: 2026-05-10
score: 96.4% (editorial-tier QC)
artifact: ~/Claude Code/.design-mocks/ruo-editorial-strategy-v3-kimi.html
---

# RUO peptide editorial-tier — reusable archetype

For B2B research procurement verticals where the buyer is a lab manager, QC chemist, or independent researcher checking COAs before purchase — NOT a retail consumer.

## Winning moves

- **Catalog-table-as-hero.** Replaces the typical product-card grid. The table IS the trust signal — Cat. No. / Compound / CAS / Purity% / MW / Stock. Mono type pulled into the chrome reads as "this site was made by people who've read a chromatogram."
- **Bézier HPLC SVG, not straight-line wireframe.** A smooth Gaussian peak with faint graticule lines and a dashed `tR` annotation is the primary "instrument, not AI" signal. Straight-segment SVG traces immediately read as schematic / fake.
- **Discount-tiered payment rails framed as processor-risk posture.** BTCPay 15% off, bank wire 10% off, NMI Direct Post at full price. Frames the choice of rail as a *researcher-protective* policy, not a vendor concession.
- **Single-accent oxidized red on paper-cream ground.** `#C7392F` on `#F5F3EE`. Does the work that a gradient would do in a moderate-tier site, without crossing into editorial violation.
- **`--fg-inv-*` token family for the single dark-ground section.** When you have ONE inverted block (the CTA), tokenize the inverse palette explicitly rather than scattering `rgba(245,243,238,0.65)` literals.

## Reusable across

- RUO peptide reagents (this case)
- RUO research chemicals (likely fit)
- Independent QC / contract analytical labs
- Reference-material / metrology vendors
- Any vertical where the buyer audits the seller before purchase

## Composition

KIMI handled v1 → v2 (layout composition + visual hierarchy + 5-vector SaaS-contamination cleanup). Director layer handled v2 → v3 (token hygiene + copy precision). Lane split holds: KIMI = layout, director = tokens + copy.
