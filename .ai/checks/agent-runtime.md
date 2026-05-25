---
name: Agent Runtime
description: Agent runtime adapter writes Mission Kernel route, trust, cost, proof, and timeline artifacts.
command: bin/cc-agent-runtime --check
expect: Status: agent-runtime-ready
---

This check proves the Mission Kernel can be driven by typed runtime adapters
instead of static display state. It initializes fixture missions through both
`local_process` and isolated `worktree` adapters, writes `AgentRunInput`,
`AgentRunResult`, trust, route, cost, proof, and normalized timeline events,
then validates the bundles and confirms the worktree run does not leak files
into the source repo.
