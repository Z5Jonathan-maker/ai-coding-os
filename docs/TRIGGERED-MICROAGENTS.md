# Triggered Microagents

`cc-triggered-microagents` selects narrow context packs from `.ai/microagents.json`
based on prompt keywords and current phase. This keeps the 500+ page wiki from
becoming default prompt noise.

Reference pattern studied: OpenHands keyword/task-triggered microagents.

```bash
cc-triggered-microagents --text "Deploy this Kimi landing page to Vercel" --phase tel_deploy
```

`cc-design-handoff continue` embeds the selected context list in
`next-action.json` so the next lane sees only the relevant docs.
