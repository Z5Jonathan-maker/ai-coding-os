"""
Auth broker — fetches credentials from Keychain first, optionally falls back
to 1Password, and caches resolved values in memory with TTL.

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
    """Keychain-first credential resolver with optional 1Password fallback."""

    def __init__(self, default_ttl_seconds: int = 300):
        self._cache: dict[str, CachedCred] = {}
        self._default_ttl = default_ttl_seconds

    def _get_from_keychain(self, service: str) -> str:
        result = subprocess.run(
            [
                "security",
                "find-generic-password",
                "-a",
                os.environ.get("USER") or os.environ.get("LOGNAME") or "",
                "-s",
                service,
                "-w",
            ],
            capture_output=True,
            text=True,
            check=True,
            timeout=5,
        )
        return result.stdout.strip()

    def _get_from_1password(self, op_path: str) -> str:
        result = subprocess.run(
            ["op", "read", op_path],
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
            env={**os.environ, "OP_FORMAT": "value"},
        )
        return result.stdout.strip()

    def get(self, op_path: str = "", keychain_service: str = "", ttl: Optional[int] = None) -> str:
        """
        Resolve a credential from Keychain first, then optional 1Password fallback.
        Returns the secret value. Caches in memory for TTL seconds.
        """
        ttl = ttl or self._default_ttl
        cache_key = keychain_service or op_path
        cached = self._cache.get(cache_key)
        if cached and cached.is_fresh():
            return cached.value

        value = ""
        if keychain_service:
            try:
                value = self._get_from_keychain(keychain_service)
            except subprocess.TimeoutExpired as e:
                raise AuthBrokerError(f"Keychain lookup timed out for {keychain_service}") from e
            except subprocess.CalledProcessError:
                value = ""
            except FileNotFoundError:
                value = ""

        if not value and op_path:
            try:
                value = self._get_from_1password(op_path)
            except subprocess.TimeoutExpired as e:
                raise AuthBrokerError(f"1Password lookup timed out for {op_path}") from e
            except subprocess.CalledProcessError as e:
                raise AuthBrokerError(
                    f"1Password lookup failed for {op_path}: {e.stderr.strip() or 'unknown error'}"
                ) from e

        if not value:
            target = keychain_service or op_path or "credential"
            raise AuthBrokerError(f"Empty credential at {target}")

        self._cache[cache_key] = CachedCred(
            value=value, fetched_at=time.time(), ttl_seconds=ttl
        )
        return value

    def invalidate(self, cache_key: str) -> None:
        """Force a re-fetch on next access (e.g. after a 401 response)."""
        self._cache.pop(cache_key, None)

    def _should_check_1password_health(self) -> bool:
        return (
            os.environ.get("TEL_CHECK_1PASSWORD_HEALTH") == "1"
            or os.environ.get("CC_ALLOW_1PASSWORD_FALLBACK") == "1"
            or bool(os.environ.get("OP_SERVICE_ACCOUNT_TOKEN"))
        )

    def health(self) -> dict:
        """Credential backends reachable?"""
        keychain_ok = False
        try:
            subprocess.run(
                ["security", "show-keychain-info", os.path.expanduser("~/Library/Keychains/login.keychain-db")],
                capture_output=True,
                text=True,
                timeout=5,
            )
            keychain_ok = True
        except Exception:
            keychain_ok = False

        if not self._should_check_1password_health():
            return {
                "ok": keychain_ok,
                "keychain_ok": keychain_ok,
                "op_ok": False,
                "op_checked": False,
                "user": None,
                "error": None if keychain_ok else "Keychain unavailable",
                "warning": None,
                "cached_creds": len(self._cache),
            }

        try:
            r = subprocess.run(
                ["op", "whoami"], capture_output=True, text=True, timeout=5
            )
            op_error = r.stderr.strip() if r.returncode != 0 else None
            return {
                "ok": keychain_ok or r.returncode == 0,
                "keychain_ok": keychain_ok,
                "op_ok": r.returncode == 0,
                "op_checked": True,
                "user": r.stdout.strip() if r.returncode == 0 else None,
                "error": None if keychain_ok else op_error,
                "warning": op_error if keychain_ok and op_error else None,
                "cached_creds": len(self._cache),
            }
        except FileNotFoundError:
            return {"ok": keychain_ok, "keychain_ok": keychain_ok, "op_ok": False, "op_checked": True, "error": None if keychain_ok else "op CLI not on PATH", "warning": "op CLI not on PATH" if keychain_ok else None, "cached_creds": len(self._cache)}
        except subprocess.TimeoutExpired:
            return {"ok": keychain_ok, "keychain_ok": keychain_ok, "op_ok": False, "op_checked": True, "error": None if keychain_ok else "op whoami timed out", "warning": "op whoami timed out" if keychain_ok else None, "cached_creds": len(self._cache)}


class AuthBrokerError(Exception):
    """Raised when credential resolution fails."""
