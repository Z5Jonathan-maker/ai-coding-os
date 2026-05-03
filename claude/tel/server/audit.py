"""
Audit log — append-only JSONL written to ~/.claude/tel/audit/<date>.jsonl.
Never committed (audit/ is .gitignored). Rotates daily by filename.

Every TEL call gets a single line. Sensitive args are redacted by
policy.redact_args() before this layer ever sees them.
"""
from __future__ import annotations

import json
import time
import uuid
from pathlib import Path
from typing import Any

AUDIT_DIR = Path.home() / ".claude" / "tel" / "audit"


def _today_path() -> Path:
    return AUDIT_DIR / f"{time.strftime('%Y-%m-%d')}.jsonl"


def write(
    *,
    service: str,
    action: str,
    args_redacted: dict,
    request_id: str,
    client: str,
    result: Any,
    ok: bool,
    duration_ms: int,
    error: str | None = None,
) -> str:
    """Write one audit entry, return the audit_id."""
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    audit_id = f"log_{uuid.uuid4().hex[:12]}"
    entry = {
        "audit_id": audit_id,
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "service": service,
        "action": action,
        "args": args_redacted,
        "request_id": request_id,
        "client": client,
        "ok": ok,
        "duration_ms": duration_ms,
        "result_hash": _short_hash(result) if ok else None,
        "error": error,
    }
    with _today_path().open("a") as f:
        f.write(json.dumps(entry) + "\n")
    return audit_id


def _short_hash(obj: Any) -> str:
    import hashlib
    return hashlib.sha256(json.dumps(obj, sort_keys=True, default=str).encode()).hexdigest()[:12]


def query(*, service: str | None = None, since_ts: str | None = None, limit: int = 100) -> list[dict]:
    """Read recent entries from today's log, optionally filtered."""
    path = _today_path()
    if not path.exists():
        return []
    out = []
    with path.open() as f:
        for line in f:
            entry = json.loads(line)
            if service and entry["service"] != service:
                continue
            if since_ts and entry["ts"] < since_ts:
                continue
            out.append(entry)
            if len(out) >= limit:
                break
    return out
