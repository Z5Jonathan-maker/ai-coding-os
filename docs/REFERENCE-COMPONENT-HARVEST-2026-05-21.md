# REFERENCE-COMPONENT-HARVEST-2026-05-21.md

Goal: close the remaining Cursor/Windsurf/Kimi-quality gaps by harvesting
proven patterns, without adding another cockpit or model menu.

## Gap Map

| Gap | Reference Pattern | Local Source | What We Harvest |
|---|---|---|---|
| Semantic repo understanding | Aider repo map / tags cache | `.aider.tags.cache.v4`, BSD `ctags`, `rg` | `cc-semantic-index` dependency-free repo symbol map |
| Diff review/apply UX | Cline/Cursor hunk-first review | Git patch hunks | `cc-diff-hunks` hunk list + patch preview for cockpit |
| Session continuity | Kimi Code `/sessions`, `--continue`, startup replay | Kimi docs + Langfuse state design | Next: cockpit session ledger keyed by cwd |
| Context pressure | Kimi context status + `/compact` | Kimi docs + route receipts | Next: context meter for prompt attachments and route windows |
| Tool connectivity | Kimi WebBridge bundled status | local `kimi-webbridge status` | `cc-kimi-status` cockpit card |
| Visual polish | Kimi/Cursor compact panel layout | VS Code webview | Keep evolving one cockpit, no duplicate shell |
| Observability | Langfuse session trace plugin | `langfuse-claude-code-plugin` | Reuse active-by-cwd and session feedback ideas later |

## Integration Rules

1. Harvest primitives, not whole apps.
2. Keep VS Code as the only cockpit.
3. Every harvested piece must expose a CLI and cockpit card/action.
4. Avoid new paid services or daemons unless the product gate knows about them.
5. Prefer dependency-free local implementations first; upgrade to richer engines
   only when the gap is proven.

## Applied In This Pass

- `cc-semantic-index`: Aider-style repo map using `ctags` + `rg`.
- `cc-diff-hunks`: Cline/Cursor-style hunk visibility using native git diff.
- Cockpit actions/cards for semantic index and diff hunks.

## Next Candidates

- `cc-session-ledger`: cwd-keyed session list, resume notes, compact summaries.
- `cc-context-meter`: estimate current prompt/context pressure before routing.
- Inline hunk apply/reject buttons using `git apply --cached/--reverse` guarded
  by confirmation.
