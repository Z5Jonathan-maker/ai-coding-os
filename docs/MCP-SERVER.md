# MCP Server

`cc-mcp-server` exposes local AI Coding OS state through a minimal stdio
MCP-compatible surface.

Current tools:

- `doctor` — daily-driver health report
- `route_plan` — in-tree route receipt for a prompt
- `design_handoff_status` — handoff status by directory

This is intentionally narrow. It lets external agents introspect state without
turning the repo into a broad integration platform.
