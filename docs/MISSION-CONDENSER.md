# Mission Condenser

`cc-mission-condenser` writes `mission.context-summary.json` for long-running
handoffs. It keeps the first events, the recent events, current phase status,
proof verdict, blockers, and next action.

Reference pattern studied: OpenHands `LLMSummarizingCondenser`.

Default mode is deterministic and free. Set `--live` or
`CC_MISSION_CONDENSER_LIVE=1` to ask the cheap lane for a richer summary.

`cc-design-handoff execute` runs it after each phase unless disabled with
`--no-condense` or `CC_DESIGN_HANDOFF_NO_CONDENSE=1`.
