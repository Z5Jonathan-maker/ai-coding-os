"""
Rollback — issues undo tokens for reversible actions, executes the inverse
operation when a valid token is presented within the undo window.

Tokens are stored in-process (lost on restart). For persistent rollback
across restarts, back this with a SQLite file. For Jonathan's single-user
local TEL the in-process map is sufficient.
"""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass

# undo_token -> UndoEntry
_UNDO_STORE: dict[str, "UndoEntry"] = {}


@dataclass
class UndoEntry:
    token: str
    service: str
    action: str
    inverse_action: str
    inverse_args: dict
    expires_at: float
    consumed: bool = False


def issue(
    *,
    service: str,
    action: str,
    inverse_action: str,
    inverse_args: dict,
    window_seconds: int,
) -> tuple[str, float]:
    """Issue an undo token. Returns (token, expires_at_unix)."""
    token = f"undo_{uuid.uuid4().hex[:16]}"
    expires = time.time() + window_seconds
    _UNDO_STORE[token] = UndoEntry(
        token=token,
        service=service,
        action=action,
        inverse_action=inverse_action,
        inverse_args=inverse_args,
        expires_at=expires,
    )
    return token, expires


def consume(token: str) -> UndoEntry | None:
    """Return the undo entry if valid + unexpired + unconsumed; mark consumed."""
    entry = _UNDO_STORE.get(token)
    if not entry:
        return None
    if entry.consumed or time.time() > entry.expires_at:
        return None
    entry.consumed = True
    return entry


def cleanup_expired() -> int:
    """Drop expired tokens from the store. Call periodically."""
    now = time.time()
    expired = [t for t, e in _UNDO_STORE.items() if e.expires_at < now or e.consumed]
    for t in expired:
        _UNDO_STORE.pop(t, None)
    return len(expired)
