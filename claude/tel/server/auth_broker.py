"""
Auth broker — fetches credentials from 1Password CLI on demand, caches in
memory with TTL, refreshes OAuth tokens when expired.

Claude never sees this code execute. The HTTP request that arrives at TEL
contains an action name; the broker resolves the credential server-side.
"""
from __future__ import annotations

import os
import subprocess
import time
from dataclasses import dataclass
from typing import Optional


@dataclass
class CachedCred:
    value: str
    fetched_at: float
    ttl_seconds: int

    def is_fresh(self) -> bool:
        return (time.time() - self.fetched_at) < self.ttl_seconds


class AuthBroker:
    """1Password-backed credential resolver with in-memory TTL cache."""

    def __init__(self, default_ttl_seconds: int = 300):
        self._cache: dict[str, CachedCred] = {}
        self._default_ttl = default_ttl_seconds

    def get(self, op_path: str, ttl: Optional[int] = None) -> str:
        """
        Resolve a 1Password reference like 'op://Personal/Gamma/credential'.
        Returns the secret value. Caches in memory for TTL seconds.
        """
        ttl = ttl or self._default_ttl
        cached = self._cache.get(op_path)
        if cached and cached.is_fresh():
            return cached.value

        try:
            result = subprocess.run(
                ["op", "read", op_path],
                capture_output=True,
                text=True,
                check=True,
                timeout=10,
                env={**os.environ, "OP_FORMAT": "value"},
            )
        except subprocess.TimeoutExpired as e:
            raise AuthBrokerError(f"1Password lookup timed out for {op_path}") from e
        except subprocess.CalledProcessError as e:
            raise AuthBrokerError(
                f"1Password lookup failed for {op_path}: {e.stderr.strip() or 'unknown error'}"
            ) from e

        value = result.stdout.strip()
        if not value:
            raise AuthBrokerError(f"Empty credential at {op_path}")

        self._cache[op_path] = CachedCred(
            value=value, fetched_at=time.time(), ttl_seconds=ttl
        )
        return value

    def invalidate(self, op_path: str) -> None:
        """Force a re-fetch on next access (e.g. after a 401 response)."""
        self._cache.pop(op_path, None)

    def health(self) -> dict:
        """1Password CLI reachable + signed in?"""
        try:
            r = subprocess.run(
                ["op", "whoami"], capture_output=True, text=True, timeout=5
            )
            return {
                "ok": r.returncode == 0,
                "user": r.stdout.strip() if r.returncode == 0 else None,
                "error": r.stderr.strip() if r.returncode != 0 else None,
                "cached_creds": len(self._cache),
            }
        except FileNotFoundError:
            return {"ok": False, "error": "op CLI not on PATH"}
        except subprocess.TimeoutExpired:
            return {"ok": False, "error": "op whoami timed out"}


class AuthBrokerError(Exception):
    """Raised when credential resolution fails."""
