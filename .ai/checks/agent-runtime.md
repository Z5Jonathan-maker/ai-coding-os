---
name: Agent Runtime
description: Agent runtime adapter writes Mission Kernel route, trust, cost, proof, and timeline artifacts.
command: bin/cc-agent-runtime --check
expect: Status: agent-runtime-ready
---

This check proves the Mission Kernel can be driven by a typed runtime adapter
instead of static display state. It initializes a fixture mission, runs a
harmless shell adapter, writes `AgentRunInput`, `AgentRunResult`, trust, route,
cost, proof, and normalized timeline events, then validates the bundle.
