# Same-Brief Capture Protocol — Premium Landing

This protocol turns `competitive.benchmark.json` from hand-assigned scores into
a real same-brief comparison. Estimated wall time: 90 minutes.

The protocol is intentionally narrow. It scores ONE brief across FOUR pipelines
(your handoff + v0 + Lovable + Bolt) on the rubric in `competitive.benchmark.json`,
then writes the captured artifacts and the blind-rated scores back in.

## The Brief (do not modify per-run)

Use this exact string in every pipeline so all four runs are comparable:

```text
premium AI-native workspace landing experience from an approved cinematic
creative reference, preserving visual direction through implementation and
proof
```

If a tool needs a longer brief, append the same supporting paragraph to all four
runs:

> Hero: full-bleed cinematic surface, headline + subhead + primary CTA.
> Below: three product pillars, social proof, pricing tier, footer.
> Visual: glass-soft surfaces, atmospheric depth, editorial-confident typography,
> low visual noise, subtle premium motion. Implementation: responsive,
> accessibility-safe native controls, no animated text replacement.

Same paragraph for all four runs or the comparison is invalid.

## Capture Directory Layout

Create on capture day:

```
fixtures/frontend-wedge/premium-landing/captures/<YYYYMMDD>/
  brief.txt                # the exact brief used
  own/
    artifacts/             # full mission artifact bundle from cc-design-handoff
    screenshot-desktop.png
    screenshot-mobile.png
    deploy-url.txt         # live URL if deployed
    notes.md               # observed strengths/gaps in your own words
  v0/
    screenshot-desktop.png
    screenshot-mobile.png
    code-export.zip        # or link if not exportable
    deploy-url.txt         # v0's preview URL
    notes.md
  lovable/
    screenshot-desktop.png
    screenshot-mobile.png
    code-link.txt          # Lovable repo or preview URL
    deploy-url.txt
    notes.md
  bolt/
    screenshot-desktop.png
    screenshot-mobile.png
    project-url.txt        # bolt.new project URL
    notes.md
  scores.json              # filled out at the end
```

The `<YYYYMMDD>` namespacing matters — competitor outputs drift week to week, so
every benchmark run is dated. Old captures stay in the tree as historical
evidence; the latest dated capture is the canonical reference.

## Step 1: Run Your Own Pipeline

On your machine:

```sh
DATE=$(date -u +%Y%m%d)
CAP=fixtures/frontend-wedge/premium-landing/captures/$DATE
mkdir -p "$CAP/own"
echo "premium AI-native workspace landing experience from an approved cinematic creative reference, preserving visual direction through implementation and proof" > "$CAP/brief.txt"

cc-design-handoff "$(cat "$CAP/brief.txt")" --out-dir "$CAP/own/artifacts" --title "Premium landing $DATE"
```

Walk the full live pipeline, one phase at a time:

```sh
D="$CAP/own/artifacts"

# 1. Live image reference
cc-design-handoff execute --dir "$D" --phase creative_reference --generate-image --image-api-ok
# review the generated visual.target.png — regenerate if not on-target
cc-design-handoff approve --dir "$D" --phase creative_reference --artifact visual.target.png --note "approved by Jonathan"

# 2. Live asset extraction (one at a time)
for asset in hero-background primary-button-style section-divider; do
  cc-design-handoff execute --dir "$D" --phase asset_decomposition --extract-asset "$asset" --image-api-ok
done
cc-design-handoff approve --dir "$D" --phase asset_decomposition --artifact creative.asset-kit.json

# 3. Live design DNA from Claude
cc-design-handoff execute --dir "$D" --phase design_dna
cc-design-handoff approve --dir "$D" --phase design_dna

# 4. Live Kimi implementation
cc-design-handoff execute --dir "$D" --phase kimi_implementation
cc-design-handoff approve --dir "$D" --phase kimi_implementation

# 5. Live Claude review
cc-design-handoff execute --dir "$D" --phase claude_review
cc-design-handoff approve --dir "$D" --phase claude_review

# 6. Deploy (manual git push to Vercel, then verify through TEL)
# After git push and Vercel auto-deploy completes:
cc-design-handoff execute --dir "$D" --phase tel_deploy --live-tel \
  --provider vercel --deployment "$DEPLOY_URL" --git-sha "$(git rev-parse HEAD)"
```

Then capture screenshots from the deployed URL at desktop (1440x900) and mobile
(390x844) sizes. Save deploy URL to `$CAP/own/deploy-url.txt`.

**Note**: any phase that ran in offline mode (because a session was down) should
be re-run live before scoring. Check every artifact for `live_lane_call: true`.

## Step 2: Run the Brief Through v0

1. Open https://v0.app (logged in)
2. New chat. Paste the exact brief from `$CAP/brief.txt`.
3. Append the supporting paragraph if v0 produces too little detail without it.
4. Let v0 generate. Iterate at most twice — keep total prompt count visible.
5. Once v0 produces a result you'd ship if v0 were your only tool, screenshot at
   1440x900 and 390x844. Save to `$CAP/v0/screenshot-desktop.png` and
   `screenshot-mobile.png`.
6. Click "Open in CodeSandbox" or "Export" — save the code archive to
   `$CAP/v0/code-export.zip`. If not exportable, save the v0 share URL to
   `code-export.zip` as a `.url` file.
7. Save the v0 preview URL to `$CAP/v0/deploy-url.txt`.
8. In `$CAP/v0/notes.md`: write 3-5 sentences on observed strengths and gaps —
   without yet looking at the rubric. First-impression notes.

Cap total time at v0 to 15 minutes including iteration.

## Step 3: Run the Brief Through Lovable

1. Open https://lovable.dev (logged in)
2. New project. Paste the exact brief + supporting paragraph.
3. Let Lovable scaffold the full app. One refinement allowed.
4. Once Lovable produces a result, screenshot at both sizes. Save under
   `$CAP/lovable/`.
5. Save the Lovable project URL or repo link to `$CAP/lovable/code-link.txt`.
6. Save the live preview URL to `$CAP/lovable/deploy-url.txt`.
7. Notes file as above.

Cap at 20 minutes (Lovable usually takes longer than v0).

## Step 4: Run the Brief Through Bolt

1. Open https://bolt.new (logged in)
2. Paste the brief + supporting paragraph.
3. Let Bolt run. One refinement allowed.
4. Once Bolt produces a result, screenshot at both sizes.
5. Save Bolt project URL to `$CAP/bolt/project-url.txt`.
6. Notes file.

Cap at 15 minutes.

## Step 5: Blind Scoring

The scoring step must be done after a break (minimum 30 min) without looking at
the `notes.md` files. The goal is to rate each output on the rubric without
recency bias from your own pipeline being fresh in your head.

Open all four screenshot pairs side by side. Score each on the rubric from
`competitive.benchmark.json`, 0-100 per dimension:

| Dimension | What you're rating |
|---|---|
| `creative_fidelity` | How closely the result preserves the cinematic / premium intent stated in the brief |
| `visual_hierarchy` | Clarity of headline → subhead → CTA → secondary content reading order |
| `brand_coherence` | Visual consistency across hero / pillars / pricing / footer sections |
| `implementation_realism` | Does the code look like you could actually ship this — responsive, real assets, real interactions, not template fillers |
| `responsive_resilience` | How well the layout holds at the mobile screenshot vs the desktop |
| `proof_quality` | What artifacts the tool produced beyond the output itself (route receipt, design rationale, design system, accessibility audit, etc.) |
| `cost_control` | Estimated marginal cost of the run — your handoff is flat-rate sub, competitors are usually metered per-prompt or per-month tier |

For each tool, compute the average across the 7 dimensions. That's the score.

A "win" requires:
- Your handoff scores ≥ 90 average, AND
- Your handoff scores higher than all three competitors, AND
- The deployed URL is real (not a localhost preview)

If any of those fail, your output didn't beat the field on this brief. Record the
honest score, don't move the threshold.

Write scores to `$CAP/scores.json`:

```json
{
  "schema": "ai-coding-os.same-brief-scores.v1",
  "captured_at": "<YYYY-MM-DDTHH:MM:SSZ>",
  "brief": "<verbatim brief>",
  "scores": {
    "own": {
      "creative_fidelity": 0,
      "visual_hierarchy": 0,
      "brand_coherence": 0,
      "implementation_realism": 0,
      "responsive_resilience": 0,
      "proof_quality": 0,
      "cost_control": 0,
      "average": 0,
      "notes": "<honest one-paragraph assessment>"
    },
    "v0": { /* same shape */ },
    "lovable": { /* same shape */ },
    "bolt": { /* same shape */ }
  },
  "win_declared": false,
  "win_required_threshold": 90,
  "honesty_constraints": [
    "Scores reflect this capture date only. Competitor outputs drift week to week.",
    "Win requires >=90 average AND higher than all three competitors AND real deployed URL.",
    "Do not adjust the threshold to manufacture a win. Record honest scores and ship them."
  ]
}
```

## Step 6: Update `competitive.benchmark.json`

Replace the hand-assigned scores in the `entries` array with the captured
averages. Add the capture date and a reference to the capture directory:

```json
{
  "tool": "ai-coding-os",
  "artifact": "fixtures/frontend-wedge/premium-landing/captures/<DATE>/own/",
  "score": <captured average>,
  "captured_at": "<YYYY-MM-DDTHH:MM:SSZ>",
  "evidence": [
    "live mission artifacts at captures/<DATE>/own/artifacts/",
    "deployed URL at captures/<DATE>/own/deploy-url.txt"
  ]
}
```

Repeat for v0, Lovable, Bolt. Commit and push.

The benchmark is now real — every `score` field is backed by a screenshot, a
deploy URL, and a dated capture directory anyone can audit.

## Step 7 (Optional): Re-run Monthly

Competitor tools change. Your tools change. Once a month, re-run this protocol
with a new date. Keep all dated captures in the tree — the trajectory of scores
over time is more informative than any single run.

## Why This Protocol Exists

The previous `competitive.benchmark.json` had hand-assigned scores (you: 92,
v0: 82, Lovable: 78, Bolt: 76) with no captured outputs from any competitor.
That's a self-assessment, not a benchmark. This protocol fixes that: same brief,
real captures, blind scoring, dated evidence, honesty constraints that prevent
threshold-moving to manufacture wins.

## Anti-Goals

- Do not score against the rubric before capturing all four pipelines. Recency
  bias toward whichever you ran last is real.
- Do not iterate competitor prompts more than twice. The benchmark is "what does
  this tool produce on a clean brief," not "what can you coax it into producing
  with extensive prompt engineering."
- Do not skip the deployed-URL requirement for your own pipeline. Generated
  artifacts that don't deploy don't beat tools whose default output IS a
  deployed preview.
- Do not score your own output blind by feel — open all four side by side and
  rate each rubric dimension explicitly. "Looks good" is not a score.
