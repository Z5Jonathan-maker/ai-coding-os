#!/usr/bin/env bash
# tel-canary.sh
# Validates TEL is import-clean WITHOUT starting the server. Catches:
# - Python upgrade regressions (e.g. system py back to 3.9)
# - Pinned dep version drift (pip somehow updated something)
# - Policy YAML syntax breaks (you edited a policy + made a typo)
# - Module import failures (refactor broke a cross-module reference)
#
# Cheap to run (~1 second). Used by mcp-probe and as standalone.
# Returns 0 on success, 1 on failure. Always prints status.
set -u

TEL_DIR="${HOME}/.claude/tel"
VENV_PY="${TEL_DIR}/.venv/bin/python"

if [ ! -x "$VENV_PY" ]; then
  echo "🔴 tel-canary: venv missing at $TEL_DIR/.venv — run tel/ops/INSTALL.md step 1"
  exit 1
fi

PY_VERSION=$("$VENV_PY" --version 2>&1)
echo "✓ tel-canary: $PY_VERSION"

cd "$TEL_DIR" || {
  echo "🔴 tel-canary: cannot cd $TEL_DIR"
  exit 1
}

OUT=$("$VENV_PY" -c "
import sys
try:
    from server import server, auth_broker, tool_registry, policy, audit, rollback
    from pathlib import Path
    reg = tool_registry.ToolRegistry(Path('policies'))
    n_services = len(reg.services)
    n_actions = sum(len(s.actions) for s in reg.services.values())
    print(f'OK services={n_services} actions={n_actions} services_list={list(reg.services.keys())}')
except Exception as e:
    print(f'FAIL: {type(e).__name__}: {e}', file=sys.stderr)
    sys.exit(1)
" 2>&1)
RC=$?

if [ $RC -eq 0 ]; then
  echo "✓ tel-canary: $OUT"
  exit 0
else
  echo "🔴 tel-canary: $OUT"
  exit 1
fi
