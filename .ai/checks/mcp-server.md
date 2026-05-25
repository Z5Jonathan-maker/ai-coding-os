---
name: MCP Server
description: Mission/router/doctor state is exposed through an MCP-compatible stdio tool surface.
command: bin/cc-mcp-server --check
expect: Status: mcp-server-ready
---

This check proves external agents can introspect the local system without
screen-scraping shell output directly.
