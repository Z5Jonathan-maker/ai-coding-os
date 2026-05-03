# Prompt Iterations

Append-only. Specific prompt-language tweaks that moved an output from < 95% to ≥ 95%. Cross-references the prompt files.

## Format

```
## YYYY-MM-DD · <prompt-file>:<scenario>
- **Before:** <prompt fragment that produced sub-95% output>
- **After:** <revised fragment>
- **Score change:** <X% → Y%>
- **Why it worked:** <one sentence>
```

---

## 2026-05-03 · prompts/product-photo.md:vial-too-3D-rendery

- **Before:** "Pharmaceutical research vial photography. Single clear glass vial..."
- **After:** Add "shot on Phase One IQ4, 80mm macro, f/8" to the front of the prompt
- **Score change:** Anecdotal — gpt-image-2 outputs have less of the "perfect-symmetry, slightly-soft-glow 3D render" signature when given a real camera reference
- **Why it worked:** Anchoring to a specific physical camera + lens forces the model to commit to optical realism over "tech render" defaults

## (Add new entries above this line.)
