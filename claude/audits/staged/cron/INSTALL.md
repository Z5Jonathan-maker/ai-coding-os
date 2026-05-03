# Staged Automation Install Guide

These artifacts are READY-TO-RUN. They live in `~/.claude/audits/staged/` until you approve installation. After install, the brain self-monitors and self-reports without you typing anything.

## What gets installed

| Artifact | Purpose | Cadence |
|---|---|---|
| `routing-drift-check.sh` | CLAUDE.md routing table ↔ skills/agents drift | Weekly |
| `memory-health-check.sh` | Auto-memory hygiene (size, orphans, stale, broken pointers) | Weekly |
| `skill-usage-tracker.sh` | Which skills actually get invoked vs gather dust | Monthly |
| `mcp-probe.sh` | MCP server reachability + re-auth surfacing | Daily |
| `self-improvement-digest.sh` | Weekly performance digest (errors, top tools, recommendations) | Weekly |

## Step 1 — make scripts executable

```bash
chmod +x ~/.claude/audits/staged/scripts/*.sh
```

## Step 2 — copy to a stable location

```bash
mkdir -p ~/.claude/scripts
cp ~/.claude/audits/staged/scripts/*.sh ~/.claude/scripts/
```

## Step 3 — install via launchd (macOS, persistent across reboots)

For each script, drop a plist in `~/Library/LaunchAgents/`. Example for the daily MCP probe:

```bash
cat > ~/Library/LaunchAgents/bio.claude.mcp-probe.plist <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>bio.claude.mcp-probe</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>$HOME/.claude/scripts/mcp-probe.sh $HOME/.claude/audits/mcp-probe-$(date +%Y-%m-%d).md</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key><integer>9</integer>
    <key>Minute</key><integer>0</integer>
  </dict>
  <key>StandardOutPath</key><string>/tmp/claude-mcp-probe.log</string>
  <key>StandardErrorPath</key><string>/tmp/claude-mcp-probe.err</string>
</dict>
</plist>
EOF
launchctl load ~/Library/LaunchAgents/bio.claude.mcp-probe.plist
```

Repeat the pattern with these calendar intervals:
- `routing-drift-check`: Mondays at 09:05 (`Weekday=1, Hour=9, Minute=5`)
- `memory-health-check`: Mondays at 09:10
- `skill-usage-tracker`: 1st of month at 09:15 (`Day=1`)
- `self-improvement-digest`: Mondays at 09:20

## Step 4 — alternative: simple crontab (one-line install)

If you prefer cron over launchd, append to `crontab -e`:

```cron
0 9 * * *   $HOME/.claude/scripts/mcp-probe.sh $HOME/.claude/audits/mcp-probe-$(date +\%Y-\%m-\%d).md
5 9 * * 1   $HOME/.claude/scripts/routing-drift-check.sh
10 9 * * 1  $HOME/.claude/scripts/memory-health-check.sh
15 9 1 * *  $HOME/.claude/scripts/skill-usage-tracker.sh 30
20 9 * * 1  $HOME/.claude/scripts/self-improvement-digest.sh 7
```

## Step 5 — phone notification (optional)

Set `NTFY_TOPIC` in your shell rc so drift checks ping your phone:

```bash
echo 'export NTFY_TOPIC=your-private-ntfy-topic' >> ~/.zshrc
```

Find your existing topic in `~/.claude/hooks/ntfy-notify.sh` if you already use ntfy.

## Step 6 — verify install

```bash
launchctl list | grep bio.claude
# OR
crontab -l | grep claude
```

Run any script manually once to confirm it works:

```bash
~/.claude/scripts/mcp-probe.sh
~/.claude/scripts/routing-drift-check.sh
```

## Removal

```bash
launchctl unload ~/Library/LaunchAgents/bio.claude.*.plist
rm ~/Library/LaunchAgents/bio.claude.*.plist
```

## What this gives you

After install, the brain self-monitors. Every Monday morning you get:
- A drift report (anything new/missing)
- A memory health snapshot
- A self-improvement digest

Every day at 9am the MCP probe runs. If anything is broken, ntfy pings your phone.

You stop typing `/health` manually. The system tells you when something's off.
