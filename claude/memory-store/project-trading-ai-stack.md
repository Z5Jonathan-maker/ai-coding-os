---
name: project-trading-ai-stack
description: "Kronos + TradingAgents evaluation for US30 trading (2026-06-08) — Kronos rejected (no edge), TradingAgents pivoted to a lean cc-router brief"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9657b9db-35c4-472b-acac-64c579e41efb
---

Evaluated the "AI analyst team feeding a discretionary trader" stack for US30
(see [[project-mym-autotrader-assistant]]). Both repos cloned to `~/code/projects/`.

**Kronos (`shiyu-coder/Kronos`) — REJECTED, no edge.** Foundation candlestick
model (HF weights NeoQuasar/Kronos-small, MPS-runnable). Tested as a per-session
US30 direction prior on 60d real YM=F 5-min data: 47.9% hit / corr −0.375 single
sample, 47.9% / −0.409 ensemble (20×). Negatively correlated, confident calls
worst. NOT integrated. Verdict + method in
`mym-autotrader/.ai/reports/2026-06-08-kronos-validation.md`. Revisit only with
shorter horizons / volatility output / longer data, always via the new
`backtest/kronos_experiment.py` + `entry_filter` hook on Backtester.
Side-finding: the strategy's weekly+daily bias gate fired ZERO trades on 60d real
US30 — too strict / needs longer history (`swing_lookback=5` weekly rarely forms
in 12 weeks).

**TradingAgents (`TauricResearch/TradingAgents`) — pivoted to lean brief.** Multi-
agent framework is end-of-day + heavily tool-calling. LLM routing solved via the
cc-router OpenAI proxy (`:9999`, start: `CC_ROUTER_PROXY_PORT=9999 node
~/AI-SYSTEM-V2/scripts/cc-router-proxy.cjs`) using provider=`ollama` (chat
completions; native `openai` provider hits /v1/responses which the proxy lacks).
BUT tool-calling doesn't survive the proxy (no function-calling) — agents emit
tool-call JSON as text. The anthropic proxy (`:9223`) emulates tools but
langchain-anthropic rejects its response schema (`model_dump` err). So the full
graph is fragile through Claude Max; it needs a NATIVE tool-calling key to shine.

**Working deliverable — lean US30 brief.** `~/code/projects/TradingAgents/
us30_brief_lean.py`: deterministic data (yfinance ^DJI daily, VIX, ATR, nearest
quarter-figures, prior-day H/L) + Google News RSS + ONE cc-router synthesis call
-> a QF-native pre-session brief (bias / key levels / news / vol / invalidation).
Verified working (routed through Claude Max, no OpenAI billing). Writes to
`~/AI-HQ/briefs/us30-brief-<date>.md`. Run on demand:
`~/code/projects/TradingAgents/.venv/bin/python us30_brief_lean.py`.
Schedule (8:30 ET weekdays) is built but NOT loaded — classifier blocks
agent-installed launchd. User loads:
`launchctl load ~/Library/LaunchAgents/com.jonathan.us30brief.plist`
(wrapper `~/AI-HQ/briefs/run-us30-brief.sh` ensures the :9999 proxy is up first).
