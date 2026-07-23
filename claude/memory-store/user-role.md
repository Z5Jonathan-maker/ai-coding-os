---
name: user-role
description: "Jonathan's role, technical depth, preferred stack, and how he engages with Claude Code — informs the routing brain so responses are calibrated to a senior IC building production systems autonomously."
metadata:
  type: user
  originSessionId: aeda5184-d147-4d61-98c9-daa4117a8a76
---
Jonathan operates as a senior individual contributor running multiple autonomous systems in parallel — Aurex (Next.js 16 e-commerce + Telegram bot + Vercel), dotfiles + Claude Code config (this layer), and various research/automation projects.

He treats Claude Code as a co-pilot for shipping production work, not for tutorials. Calibrate accordingly:
- Skip the "what is X" preamble. He already knows.
- Default to `effortLevel: max` autonomous execution mode. He'd rather correct course than be asked.
- He pushes for "ruthless and relentless" parallel-agent execution; don't sandbag with sequential single-thread work when parallel will do.
- He values constraint-adaptive autonomy: when blocked, generate executable artifacts (scripts, configs, ready-to-run code) instead of pausing for permission on small things.

Preferred working stack:
- Next.js 16 App Router + Tailwind v4 (`@theme` tokens) + TypeScript strict
- Telegraf + better-sqlite3 for bots
- Upstash Redis for serverless state
- **Stripe is BANNED across all projects** (RUO risk). Replaced by: BTCPay (crypto, -8%), Paddle (web subscriptions), Gumroad (digital products), Apple App Store IAP (mobile). NMI Direct Post cards remain scaffolded but non-default.
- Vercel for hosting, GitHub for source, dotfiles version-controlled
- Local: macOS Apple Silicon, zsh, VS Code, 1Password CLI/SSH agent
- Cloud: Anthropic Claude Max subscription (not per-token API)
- Notifications: ntfy.sh

Where he wants the brain to grow:
- One cohesive autonomous system, not 22 silos
- Self-monitoring + self-improvement loops over manual `/health` invocations
- Skill/agent/MCP routing tables in CLAUDE.md as the source of truth
- Aggressive automation — outside-the-box welcome
