# Grey-Area Arsenal

Monitor, archive, and analyze controversial GitHub repositories across 8 categories.

## Status

- **64 repos tracked** across 8 categories
- **54 alive** (all archived locally)
- **10 removed** (5 DMCA, 5 gone)
- **Daily auto-scan** at 06:00 via cron

## Categories

| Category | Alive | Removed | Top Repo |
|----------|------:|--------:|----------|
| media_downloaders | 12 | 2 | yt-dlp (160K⭐) |
| osint_scraping | 9 | 0 | sherlock (82K⭐) |
| ai_leaks | 6 | 4 | system_prompts_leaks (39K⭐) |
| reverse_engineering | 6 | 1 | ILSpy (25K⭐) |
| adblock_paywall | 5 | 2 | uBlock (64K⭐) |
| crypto_privacy | 5 | 0 | monero (10K⭐) |
| drm_circumvention | 3 | 1 | widevine-l3-decryptor (1.2K⭐) |
| game_cheats | 4 | 1 | cheat-engine (18K⭐) |

## Commands

```bash
# Full scan + archive all alive repos
cc-ghmon --archive

# Check single repo status
cc-ghmon --repo owner/repo

# View latest report
cat ~/.claude/gh-mon/report.md

# Browse local archive
ls ~/.claude/gh-archive/

# View scan history
cat ~/.claude/gh-mon/scan.log
```

## Files

- `~/.claude/gh-mon/repos.json` — tracked repo catalog
- `~/.claude/gh-mon/state.json` — latest scan state
- `~/.claude/gh-mon/full-scan.json` — full scan results
- `~/.claude/gh-mon/report.md` — human-readable report
- `~/.claude/gh-archive/` — cloned repo archive (54 repos)

## DMCA Tracking

5 repos confirmed DMCA'd (451):
- PopcodeMobile/claude-code-leaked
- libbom14/claude-code-leacked
- hermon1738/claude-code-main-leak
- hack-sam/claude-code
- iamadamdev/bypass-paywalls-chrome

## Integration

- **Tiered router**: `octagents` tier can reference archive for competitive intel
- **Swarm**: `cc-swarm-learn` auto-generates skills from archived repo docs
- **Scheduler**: `crontab` entry runs daily scan
