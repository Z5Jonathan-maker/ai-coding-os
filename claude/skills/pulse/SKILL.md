---
name: pulse
description: Token-efficient code generation protocol. Cuts ~60-70% of generated-code tokens while preserving identical behavior. Different from /caveman (which compresses CONVERSATIONAL output). Use when the user says "/pulse", "tighten this code", "compact", "less code, same behavior", "reduce file size", "remove bloat", before generating any net-new file, or when a previous response wrote code that could be 70% shorter. Inspired by the PULSE-TOKEN-EFFICIENCY-COMPACTOR.md protocol (Wassim Younes free Drive bundle, April 2026).
---

# pulse — code-density protocol

Different lane from `/caveman`:
- **caveman** compresses *conversational output* (drop articles, filler, hedging in your prose)
- **pulse** compresses *generated code* (dense functions, no obvious comments, single-pass logic)

Both can be active at once. They never fight.

Reference source (verbatim): `~/code/research/wassim-drive/PULSE-TOKEN-EFFICIENCY-COMPACTOR.md`

## When pulse is on

### Code-density rules

1. **No comments that restate what the code does.** Variable names + obvious flow ARE the comments. Only write comments for *why* (constraints, gotchas, surprising behavior).
2. **One-line guards over multi-line null checks.** `if (!d?.name || !d?.email) return null;` not 6 lines of `if (x === undefined) ...`
3. **Inline trivial extracts.** Don't `const userName = userData.name;` then return `userName` — return `userData.name` directly.
4. **No defensive code for impossible scenarios.** If the type system already prevents `null`, don't check for `null`.
5. **Single-letter or 2-3-char param names for short scopes.** `function f(d)` is fine in a 3-line function. Long names belong on long-lived APIs.
6. **Object shorthand + spread + destructuring.** `{ name, email } = user`, `{ ...rest, processed: true }`.
7. **No try/catch around code that can't throw.** No `await`-wrap if the function returns a value, not a promise.
8. **Compose small functions over copying.** If you wrote the same 3-line block twice, extract.
9. **Use language idioms.** `arr.map(...).filter(...).reduce(...)` over imperative loops UNLESS the perf path matters.
10. **Module structure: 1 export per file ONLY when sharing.** Co-locate trivially-related helpers.

### Pre-write check (before generating any new file)

- Estimate target line count. If it's >50, ask: can it be 25? Most "200-line implementations" should be 50-80.
- Decide on names BEFORE writing. Renaming after is wasteful tokens.
- If the answer is "create N files," ask: can it be 1?

### Post-write pass (after generating)

Re-read what you just wrote and apply:
- Drop any comment that restates code
- Collapse single-use temp variables
- Inline single-use helpers
- Remove unused imports
- Cut blank lines between tightly-coupled code

### What pulse does NOT do

- **Doesn't sacrifice readability.** Dense ≠ obfuscated. The compact form must be obviously correct from inspection.
- **Doesn't strip type annotations.** Types ARE documentation in a typed language.
- **Doesn't merge long lines past 100 chars** unless removing real waste.
- **Doesn't apply to test code.** Tests are read more than they're written; clarity > density.
- **Doesn't apply to error messages or user-facing strings.** Be human there.
- **Doesn't override project-CLAUDE.md style rules.** If a project has a 4-space-indent / one-statement-per-line house style, follow it.

## Example transforms

### TypeScript guard
```ts
// pulse OFF (~85 tok)
function getDisplayName(user: User | null): string | null {
  if (user === null) return null;
  if (user.name === undefined || user.name === null) return null;
  if (user.name.length === 0) return null;
  return user.name;
}

// pulse ON (~25 tok)
const getDisplayName = (u: User | null) => u?.name?.trim() || null;
```

### Bash hook
```bash
# pulse OFF (~70 tok)
if [ -z "$VAR" ]; then
  echo "VAR is not set"
  exit 1
fi
RESULT=$(some_command)
if [ $? -ne 0 ]; then
  echo "command failed"
  exit 1
fi
echo "$RESULT"

# pulse ON (~30 tok)
[ -n "$VAR" ] || { echo "VAR not set" >&2; exit 1; }
some_command || { echo "failed" >&2; exit 1; }
```

### React component
```tsx
// pulse OFF (~110 tok)
export function Greeting(props: { name: string; onClick: () => void }) {
  const userName = props.name;
  const handleClick = () => {
    props.onClick();
  };
  return (
    <button onClick={handleClick}>
      Hello, {userName}!
    </button>
  );
}

// pulse ON (~50 tok)
export const Greeting = ({ name, onClick }: { name: string; onClick: () => void }) => (
  <button onClick={onClick}>Hello, {name}!</button>
);
```

## Composition with the rest of the stack

| Skill / hook | How pulse composes |
|---|---|
| `caveman` | Same intensity-tier UX (lite / full / ultra). Use both: caveman for what you say, pulse for what you write |
| `karpathy-guidelines` | Pulse implements Karpathy's "Simplicity First" + "no overcomplicate" principles for code |
| `wired-up-stop` | Pulse-dense code is harder to leave orphaned because there's less of it |
| `/design` + `/huashu-design` | Pulse the GENERATED HTML/CSS — no commented-out stubs, no defensive `if (typeof window !== 'undefined')` when it's needed once |
| `loop-guard` | Pulse-dense code = fewer regenerations needed = fewer loop-guard hits |

## Activation / deactivation

`/pulse on` = active for the rest of the session
`/pulse off` = back to default verbosity
`/pulse <intensity>` = lite | full | ultra (mirrors caveman's intensity scale)

Default on activation: **full** (matches caveman).
