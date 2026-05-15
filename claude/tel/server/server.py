"""
TEL — Trusted Execution Layer

FastAPI server that receives structured action requests from Claude (via
the tel-call.sh wrapper), resolves credentials from Keychain first with
optional 1Password fallback, validates
against the per-service policy whitelist, executes, audits, and returns
the result.

Listens on 127.0.0.1:8765 only. Never exposed to the network.

Run:
    uvicorn server.server:app --host 127.0.0.1 --port 8765 --log-level info

Or load via launchd (see ops/bio.tel.plist).
"""
from __future__ import annotations

import time
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from . import audit, policy, rollback
from .auth_broker import AuthBroker, AuthBrokerError
from .tool_registry import ToolRegistry

POLICIES_DIR = Path(__file__).resolve().parent.parent / "policies"

app = FastAPI(title="TEL — Trusted Execution Layer", version="0.1.0")
broker = AuthBroker()
registry = ToolRegistry(POLICIES_DIR)


class ExecuteRequest(BaseModel):
    service: str
    action: str
    args: dict = Field(default_factory=dict)
    request_id: str
    client: str = "claude-code"
    dry_run: bool = False


class ExecuteResponse(BaseModel):
    ok: bool
    result: dict | None = None
    audit_id: str
    undo_token: str | None = None
    expires_at: float | None = None
    error: str | None = None


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "version": "0.1.0",
        "auth_broker": broker.health(),
        "services": [s["service"] for s in registry.list_services()],
    }


@app.get("/registry")
def list_registry() -> dict:
    return {"services": registry.list_services()}


@app.post("/reload")
def reload_registry() -> dict:
    registry.reload()
    return {"ok": True, "services": [s["service"] for s in registry.list_services()]}


@app.post("/execute", response_model=ExecuteResponse)
def execute(req: ExecuteRequest) -> ExecuteResponse:
    started = time.perf_counter()
    args_redacted = policy.redact_args(req.args)

    spec = registry.get_action(req.service, req.action)
    if not spec:
        audit_id = audit.write(
            service=req.service,
            action=req.action,
            args_redacted=args_redacted,
            request_id=req.request_id,
            client=req.client,
            result=None,
            ok=False,
            duration_ms=int((time.perf_counter() - started) * 1000),
            error="action_not_in_registry",
        )
        raise HTTPException(
            status_code=403,
            detail={"error": "action_not_in_registry", "audit_id": audit_id},
        )

    errs = registry.validate_args(spec, req.args)
    if errs:
        audit_id = audit.write(
            service=req.service,
            action=req.action,
            args_redacted=args_redacted,
            request_id=req.request_id,
            client=req.client,
            result=None,
            ok=False,
            duration_ms=int((time.perf_counter() - started) * 1000),
            error=f"arg_validation: {errs}",
        )
        raise HTTPException(
            status_code=400,
            detail={"error": "arg_validation", "messages": errs, "audit_id": audit_id},
        )

    allowed, count = policy.check_rate_limit(
        req.service, req.action, spec.rate_limit_per_hour
    )
    if not allowed:
        audit_id = audit.write(
            service=req.service,
            action=req.action,
            args_redacted=args_redacted,
            request_id=req.request_id,
            client=req.client,
            result=None,
            ok=False,
            duration_ms=int((time.perf_counter() - started) * 1000),
            error=f"rate_limited (count={count}, limit={spec.rate_limit_per_hour}/hr)",
        )
        raise HTTPException(
            status_code=429,
            detail={"error": "rate_limited", "audit_id": audit_id, "limit": spec.rate_limit_per_hour},
        )

    if req.dry_run:
        audit_id = audit.write(
            service=req.service,
            action=req.action,
            args_redacted=args_redacted,
            request_id=req.request_id,
            client=req.client,
            result={"dry_run": True},
            ok=True,
            duration_ms=int((time.perf_counter() - started) * 1000),
        )
        return ExecuteResponse(
            ok=True,
            result={"dry_run": True, "would_call": spec.endpoint},
            audit_id=audit_id,
        )

    try:
        token = broker.get(spec.auth_op_path, getattr(spec, "auth_keychain_service", ""))
    except AuthBrokerError as e:
        audit_id = audit.write(
            service=req.service,
            action=req.action,
            args_redacted=args_redacted,
            request_id=req.request_id,
            client=req.client,
            result=None,
            ok=False,
            duration_ms=int((time.perf_counter() - started) * 1000),
            error=f"auth_broker: {e}",
        )
        raise HTTPException(
            status_code=502,
            detail={"error": "auth_broker_failed", "audit_id": audit_id, "message": str(e)},
        )

    svc = registry.services[req.service]
    url = svc.base_url.rstrip("/") + "/" + spec.endpoint.lstrip("/")
    headers = {spec.auth_header: f"{spec.auth_prefix} {token}".strip()}

    try:
        with httpx.Client(timeout=30) as http:
            r = http.request(
                spec.method.upper(),
                url,
                headers=headers,
                json=req.args if spec.method.upper() in {"POST", "PUT", "PATCH"} else None,
                params=req.args if spec.method.upper() in {"GET", "DELETE"} else None,
            )
        ok = r.is_success
        try:
            result = r.json()
        except ValueError:
            result = {"raw": r.text[:1000]}
    except httpx.RequestError as e:
        audit_id = audit.write(
            service=req.service,
            action=req.action,
            args_redacted=args_redacted,
            request_id=req.request_id,
            client=req.client,
            result=None,
            ok=False,
            duration_ms=int((time.perf_counter() - started) * 1000),
            error=f"http_error: {e}",
        )
        raise HTTPException(
            status_code=502,
            detail={"error": "downstream_unreachable", "audit_id": audit_id, "message": str(e)},
        )

    duration_ms = int((time.perf_counter() - started) * 1000)
    audit_id = audit.write(
        service=req.service,
        action=req.action,
        args_redacted=args_redacted,
        request_id=req.request_id,
        client=req.client,
        result=result,
        ok=ok,
        duration_ms=duration_ms,
    )

    undo_token = None
    expires_at = None
    if ok and spec.reversible and spec.undo_window_seconds > 0:
        undo_token, expires_at = rollback.issue(
            service=req.service,
            action=req.action,
            inverse_action=f"undo_{req.action}",
            inverse_args={"target_id": result.get("id") or result.get("presentation_id")},
            window_seconds=spec.undo_window_seconds,
        )

    if not ok and r.status_code == 401:
        broker.invalidate(spec.auth_op_path)

    return ExecuteResponse(
        ok=ok,
        result=result if ok else None,
        audit_id=audit_id,
        undo_token=undo_token,
        expires_at=expires_at,
        error=None if ok else f"downstream_status: {r.status_code}",
    )


@app.post("/undo/{undo_token}")
def undo(undo_token: str) -> dict:
    entry = rollback.consume(undo_token)
    if not entry:
        raise HTTPException(status_code=404, detail="invalid_or_expired_token")
    return {
        "ok": True,
        "would_invoke": {
            "service": entry.service,
            "action": entry.inverse_action,
            "args": entry.inverse_args,
        },
        "note": "TEL records the undo intent; per-service inverse logic ships in v0.2",
    }


@app.get("/audit/recent")
def audit_recent(service: str | None = None, limit: int = 50) -> dict:
    return {"entries": audit.query(service=service, limit=limit)}
