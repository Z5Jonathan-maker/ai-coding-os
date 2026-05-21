# DISK-READINESS-AUDIT-2026-05-21.md

Current acceptance gate:

```text
cc-system-demo -> disk headroom failed
available: 21GB
required: 25GB
preferred: 50GB
```

This is the main blocker between "operational" and "100% functional for
autonomous work." Browser automation, local transcription, model caches, build
artifacts, and repo worktrees need free disk.

## Large Areas Found

Read-only audit:

```text
17G   ~/code
7.0G  ~/AI-SYSTEM-V2-ARCHIVE
6.8G  ~/.claude
6.8G  ~/.cache
5.2G  ~/AI-SYSTEM-V2-MIGRATION
1.9G  ~/Library/Caches
1.7G  ~/.npm
1.3G  ~/Downloads
469M  ~/.Codex
```

Largest specific candidates:

```text
5.2G  ~/.claude/gh-archive
5.2G  ~/AI-SYSTEM-V2-ARCHIVE/projects
5.2G  ~/AI-SYSTEM-V2-MIGRATION/01-backups-compressed.tar.gz
3.9G  ~/.cache/huggingface
1.4G  ~/AI-SYSTEM-V2-ARCHIVE/research
1.1G  ~/.claude/projects
748M  ~/.cache/codex-runtimes
606M  ~/.cache/whisper-cpp
533M  ~/.cache/whisper
412M  ~/.cache/pre-commit
314M  ~/.cache/chrome-devtools-mcp
```

Existing prune dry-run:

```text
CC_PRUNE_DRY_RUN=1 ~/dotfiles/bin/cc-prune
would remove 3699 files older than 14d in ~/.claude/file-history
estimated gain: small (~52M area)
```

## Recommended Cleanup Order

No deletion should happen without explicit approval.

1. **Archive migration backup review**
   - Candidate: `~/AI-SYSTEM-V2-MIGRATION/01-backups-compressed.tar.gz`
   - Potential gain: 5.2GB
   - Action: delete only if the migration backup is superseded elsewhere.

2. **Inactive project archive review**
   - Candidate: `~/AI-SYSTEM-V2-ARCHIVE/projects`
   - Potential gain: 5.2GB
   - Action: move to external storage or delete only after confirming no active dependency.

3. **GitHub archive review**
   - Candidate: `~/.claude/gh-archive`
   - Potential gain: 5.2GB
   - Action: archive/compress/remove only if not needed for current research.

4. **Model/cache cleanup**
   - Candidates: HuggingFace, Whisper, Whisper CPP, pre-commit, chrome-devtools MCP
   - Potential gain: 5GB+
   - Action: safe to regenerate, but may cost time/network later.

5. **Run safe prune**
   - Command: `~/dotfiles/bin/cc-prune`
   - Potential gain: small
   - Action: safe policy cleanup for Claude logs/history.

## Readiness Target

Minimum:

```text
25GB free -> cc-system-demo passes
```

Preferred:

```text
50GB free -> enough headroom for autonomous browser/code/transcription loops
```

