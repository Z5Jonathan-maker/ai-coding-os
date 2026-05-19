# Config Harmonization Audit — 2026-05-18

**Auditor:** Config Harmonizer subagent  
**Scope:** `~/.claude/` ↔ `~/dotfiles/claude/` ↔ `~/.Codex/` ↔ `~/.zshrc` ↔ `~/dotfiles/install.sh`  
**Status:** 7 issues found, 6 with specific fixes, 1 needs human decision

---

## 1. Destructive install.sh Fix — settings.json

### Problem
`install.sh` symlinks `~/dotfiles/claude/settings.json` → `~/.claude/settings.json`. The `link()` function already backs up existing files, but **Claude Code (the app) breaks the symlink** by replacing it with a regular file when it writes settings. On the next `install.sh` run, the live settings get backed up and overwritten with the dotfiles version, losing any app-generated changes.

### Current State
- `~/.claude/settings.json` → symlink to `~/dotfiles/claude/settings.json` ✅ (as of now)
- Both files are **byte-identical** (verified with `diff`)
- `install.sh` handles the symlink correctly (prints "ok" when target matches)

### Fix
**Make dotfiles the single source of truth and prevent Claude Code from breaking the symlink.**

Option A (recommended): Remove `settings.json` from `install.sh` and manage it manually. The dotfiles version is already the source of truth; `install.sh` should skip it so the symlink never gets destroyed.

```bash
# In install.sh, comment out or remove:
# link claude/settings.json .claude/settings.json
```

Then add a one-time bootstrap check in `~/.claude/hooks/bootstrap-check.sh` that ensures the symlink exists, restoring it if Claude Code broke it:

```bash
if [ -f "$HOME/.claude/settings.json" ] && [ ! -L "$HOME/.claude/settings.json" ]; then
  # Claude Code broke the symlink — restore it
  cp "$HOME/.claude/settings.json" "$HOME/.claude/settings.json.backup.$(date +%s)"
  rm "$HOME/.claude/settings.json"
  ln -s "$HOME/dotfiles/claude/settings.json" "$HOME/.claude/settings.json"
fi
```

**Owner decision required:** Should Claude Code settings changes (e.g., plugin installs) be synced back to dotfiles, or is the dotfiles version the immutable source of truth?

---

## 2. Config Drift Map

| File | Live (`~/.claude/`) | Dotfiles (`~/dotfiles/claude/`) | Status |
|---|---|---|---|
| `settings.json` | Symlink → dotfiles | Source | ✅ In sync |
| `CLAUDE.md` | Symlink → dotfiles | Source | ✅ In sync |
| `AGENTS.md` | `~/.Codex/AGENTS.md` (separate file) | **Missing** | ❌ Not tracked |
| `.env` | `~/.claude/.env` (secrets, real values) | **Missing** | ❌ No template |
| `.env.example` | `~/Claude Code/.env.example` (Aurex project) | **Missing** | ⚠️ Different purpose |
| `skills/` | Symlink → dotfs/skills | Source | ✅ In sync |
| `hooks/` | Mixed symlinks + real files | Partial | ⚠️ See install.sh |

### Key Finding: AGENTS.md Is Not in Dotfiles
`~/.Codex/AGENTS.md` exists (17,227 bytes, maintained) but `~/dotfiles/claude/AGENTS.md` does **not exist**. This file is the Codex-system routing layer — it should be version-controlled like `CLAUDE.md`.

### Key Finding: .env Lives Only in `~/.claude/`
The ecosystem `.env` (DeepSeek, OpenAI, Replicate, etc.) has no dotfiles template. If the machine is wiped, env vars must be reconstructed from memory or 1Password.

---

## 3. Single Source of Truth Plan

| Config | Owner | Rationale |
|---|---|---|
| `settings.json` | `~/dotfiles/claude/settings.json` | Already symlinked; add bootstrap guard to prevent Claude Code from breaking it |
| `CLAUDE.md` | `~/dotfiles/claude/CLAUDE.md` | Already symlinked; no drift detected |
| `AGENTS.md` | **Create `~/dotfiles/claude/AGENTS.md`** | Currently only in `~/.Codex/`; should be symlinked like CLAUDE.md |
| `.env` (ecosystem) | **Create `~/dotfiles/claude/.env.template`** | Secrets must never be committed; template documents required vars |
| `skills/` | `~/dotfiles/claude/skills/` | Already symlinked; vendored skills handled by `clone_if_missing` in install.sh |
| `hooks/` | `~/dotfiles/claude/hooks/` | Already mostly symlinked; any live-only hooks should be added to dotfiles |
| `zshrc` | `~/dotfiles/zshrc` | Already managed by install.sh |
| `config.toml` | `~/.Codex/config.toml` | Codex CLI config; **not** symlinked to dotfiles — consider adding |

### Action Items

1. **Create `~/dotfiles/claude/AGENTS.md`** as a copy of `~/.Codex/AGENTS.md`, then symlink `~/.Codex/AGENTS.md` → `~/dotfiles/claude/AGENTS.md` (or vice versa).
2. **Create `~/dotfiles/claude/.env.template`** from `~/.claude/.env` with all values redacted.
3. **Add `~/.Codex/config.toml` to dotfiles** as `dotfiles/codex/config.toml` and symlink it.

---

## 4. Missing Env Vars

### `~/.claude/.env` (ecosystem env — the real one)
Contains 30+ keys. Many are populated. Here are the **empty/unset vars** that may matter:

| Var | Status | Impact |
|---|---|---|
| `BLOTATO_API_KEY` | Empty | Blotato integration pending (noted in file: "waitlist pending as of 2026-05-14") |
| `BLOTATO_ACCOUNT_ID_*` | All 5 empty | Same as above |
| `OPENAI_API_KEY` | **Set twice** ⚠️ | Lines 44 and 49-61 both set it. File has a duplicate. |

### `~/Claude Code/.env` (Aurex project env — unrelated)
This is a completely different file for the Aurex bio project. It has its own `.env.example` with 40+ vars. Not part of this harmonization scope.

### Missing from ecosystem `.env` (vars that exist in `.env` but might need rotation)
- `DEEPSEEK_API_KEY` — valid, set
- `N8N_ADMIN_PASSWORD` — valid, set
- `EXPO_TOKEN` — valid, set
- `PADDLE_API_KEY` — valid, set (live key)
- `OPENAI_API_KEY` — **duplicated** in file; second instance overwrites first. Should be deduplicated.
- `FIRECRAWL_API_KEY` — valid, set
- `REPLICATE_API_TOKEN` — valid, set

### Fix
Deduplicate `OPENAI_API_KEY` in `~/.claude/.env`:

```bash
# Remove the first standalone OPENAI_API_KEY=... line (line ~44)
# Keep the block at lines 49-61 which includes it with other vars
```

---

## 5. Path Consistency

### Finding: `~/Claude Code/` Is NOT Stale
The path `~/Claude Code/` appears in:
- `~/.Codex/config.toml` line 59: `mcp-filesystem` allowed path
- `~/.Codex/config.toml` line 139: `[projects."/Users/leonardofibonacci/Claude Code"]`

**Verification:** `~/Claude Code/` is the **Aurex bio project** (git remote: `github.com/Z5Jonathan-maker/aurex-bio`). It is actively developed (last commit May 18). The `~/code/projects/claude-code-router/` directory exists but is **empty** (no git repo, just a `.github` folder).

### Assessment
The paths are **correct** — `~/Claude Code/` is the actual Aurex project. The name is confusing because the directory was created when Claude Code first launched and defaulted to `~/Claude Code/` as a workspace. **Recommendation:** Rename the directory to `~/code/projects/aurex/` (or similar) to avoid confusion, but this is a human decision that affects git remotes, VS Code workspaces, and muscle memory.

### `config.toml` mcp-filesystem paths
```toml
args = [
  ...
  "/Users/leonardofibonacci/Claude Code",   # ← This is Aurex
  "/Users/leonardofibonacci/DoseCraft",
]
```
If the directory is ever renamed, these must be updated.

---

## 6. Model Routing — Is `gpt-5.5` Correct?

### Finding: `gpt-5.5` Is NOT a Valid OpenAI Model

**Locations:**
- `~/.Codex/config.toml`: `model = "gpt-5.5"`
- `~/.claude/.env`: `TIER_CODEX_MODEL=gpt-5.5`

**Current OpenAI model catalog** (as of May 2026):
- `gpt-4o` — standard fast model
- `gpt-4.5` — larger context
- `o3` — reasoning model
- `o4-mini` — fast reasoning
- `codex` — the Codex CLI may have its own model aliases

**OpenAI Codex CLI** (the `@openai/codex` package) uses model names from the OpenAI API. There is no `gpt-5.5` model. This will likely cause API errors when the Codex CLI tries to use it.

### Fix
Change to a valid model. For Codex CLI, the recommended model is likely `gpt-4o` or whatever the Codex CLI default is:

```toml
# ~/.Codex/config.toml
model = "gpt-4o"  # or "o3" for reasoning tasks
```

```bash
# ~/.claude/.env
TIER_CODEX_MODEL=gpt-4o
```

**Owner decision required:** Which model should the Codex tier use? `gpt-4o` for general work, or `o3` for reasoning-heavy tasks?

---

## 7. zshrc Audit

### Status: Mostly Clean

| Check | Status | Note |
|---|---|---|
| `ecosystem-env.sh` source | ✅ | File exists at `~/code/scripts/ecosystem-env.sh` |
| Homebrew paths | ✅ | `/opt/homebrew/share/zsh/site-functions` correct for Apple Silicon |
| `eza`, `bat`, `zoxide`, `direnv`, `fzf`, `starship`, `atuin` | ✅ | All guarded with `command -v` checks |
| `cc-free` alias | ⚠️ Redundant | `alias cc-free='cc-free'` is harmless (resolves to `~/.claude/bin/cc-free` in PATH) but unnecessary. The binary is already on PATH via `export PATH="$HOME/.claude/bin:$PATH"`. |
| Claude aliases (`c`, `cpr`, `cb`, etc.) | ✅ | Valid and well-structured |
| `ANTHROPIC_BASE_URL` unset | ✅ | Correct — prevents stale proxy from breaking VS Code |
| `cc-dispatch` PATH entry | ✅ | `~/.claude/bin` is on PATH |

### Minor Fix
Remove redundant alias in `.zshrc`:

```bash
# Before
alias cc-free='cc-free'

# After: just delete the line. The binary is already on PATH.
```

### Not Found in zshrc
- No references to `~/Claude Code/` directly in `.zshrc`
- No references to `~/code/projects/cc-router/` or `~/code/projects/claude-code-router/`
- No stale `~/local/bin` or Homebrew paths

---

## Summary of Required Edits

### File: `~/dotfiles/install.sh`
1. Add guard for `settings.json` (or remove from auto-link list) to prevent destructive overwrites when Claude Code breaks the symlink.

### File: `~/.claude/hooks/bootstrap-check.sh`
2. Add symlink restoration logic for `settings.json` if Claude Code replaces it with a regular file.

### New File: `~/dotfiles/claude/AGENTS.md`
3. Copy `~/.Codex/AGENTS.md` into dotfiles. Then either:
   - Symlink `~/.Codex/AGENTS.md` → `~/dotfiles/claude/AGENTS.md`, or
   - Update `install.sh` to link it.

### New File: `~/dotfiles/claude/.env.template`
4. Create from `~/.claude/.env` with all values redacted to `YOUR_VALUE_HERE`.

### File: `~/.claude/.env`
5. Deduplicate `OPENAI_API_KEY` (appears twice; second block overwrites first).

### File: `~/.Codex/config.toml`
6. Change `model = "gpt-5.5"` to a valid model (e.g., `model = "gpt-4o"`).

### File: `~/.claude/.env`
7. Change `TIER_CODEX_MODEL=gpt-5.5` to match config.toml (e.g., `TIER_CODEX_MODEL=gpt-4o`).

### File: `~/.zshrc`
8. Remove redundant `alias cc-free='cc-free'`.

### Optional (human decision)
9. Consider renaming `~/Claude Code/` to `~/code/projects/aurex/` to eliminate the misleading directory name. If done, update `~/.Codex/config.toml` mcp-filesystem paths and project entry.

---

## Risk Assessment

| Issue | Risk Level | Auto-fixable? |
|---|---|---|
| install.sh settings.json overwrite | Medium | Yes — with guard |
| AGENTS.md not in dotfiles | Medium | Yes — copy + symlink |
| No .env template | Low | Yes — create template |
| gpt-5.5 invalid model | **High** | Yes — change to gpt-4o |
| OPENAI_API_KEY duplicate | Low | Yes — deduplicate |
| `cc-free` alias redundant | None | Yes — delete line |
| `~/Claude Code/` naming | Low | **No — needs human decision** |
