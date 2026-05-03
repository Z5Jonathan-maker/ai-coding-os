"""
Policy engine — rate limits, dry-run mode, per-action approval rules,
sensitive-arg redaction for the audit log.

Stateless except for the in-process rate counter (resets on restart). For
production-grade rate limiting, swap with Redis; for a single-user local
TEL this is sufficient.
"""
from __future__ import annotations

import time
from collections import defaultdict, deque

# (service, action) -> deque of recent call timestamps
_RATE_BUCKET: dict[tuple[str, str], deque[float]] = defaultdict(deque)

# Args that should NEVER appear verbatim in audit logs (case-insensitive substring match)
SENSITIVE_ARG_PATTERNS = (
    "password",
    "token",
    "secret",
    "key",
    "auth",
    "cred",
    "session",
    "cookie",
)


def check_rate_limit(service: str, action: str, limit_per_hour: int) -> tuple[bool, int]:
    """
    Returns (allowed, current_count_in_window). Adds the current call to the
    bucket if allowed. Window is rolling 60 minutes.
    """
    now = time.time()
    bucket = _RATE_BUCKET[(service, action)]

    # Drop calls older than 1 hour
    while bucket and bucket[0] < now - 3600:
        bucket.popleft()

    if len(bucket) >= limit_per_hour:
        return False, len(bucket)

    bucket.append(now)
    return True, len(bucket)


def redact_args(args: dict) -> dict:
    """Replace sensitive arg values with a hash placeholder for audit logging."""
    redacted = {}
    for k, v in args.items():
        if any(p in k.lower() for p in SENSITIVE_ARG_PATTERNS):
            redacted[k] = "<redacted>"
        elif isinstance(v, str) and len(v) > 500:
            redacted[k] = f"<truncated: {len(v)} chars>"
        else:
            redacted[k] = v
    return redacted


def should_dry_run(envelope: dict) -> bool:
    return envelope.get("dry_run", False) is True
