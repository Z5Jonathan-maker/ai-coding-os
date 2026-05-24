"""
Tool registry — loads per-service action whitelists from policies/*.yaml,
exposes lookup + validation for the executor.

A service is a YAML file like policies/gamma.yaml describing which actions
the TEL is allowed to perform on the user's behalf, with arg schemas and
reversibility metadata.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class ActionSpec:
    name: str
    description: str
    method: str  # HTTP verb or SDK call
    endpoint: str  # URL template or SDK path
    required_args: list[str] = field(default_factory=list)
    optional_args: list[str] = field(default_factory=list)
    reversible: bool = False
    undo_window_seconds: int = 0
    rate_limit_per_hour: int = 100
    auth_op_path: str = ""
    auth_keychain_service: str = ""
    auth_header: str = "Authorization"
    auth_prefix: str = "Bearer"
    allowed_query_prefixes: list[str] = field(default_factory=list)


@dataclass
class ServiceSpec:
    name: str
    base_url: str
    actions: dict[str, ActionSpec]
    notes: str = ""


class ToolRegistry:
    """Loads + serves the per-service action whitelist."""

    def __init__(self, policies_dir: Path):
        self.policies_dir = policies_dir
        self.services: dict[str, ServiceSpec] = {}
        self.reload()

    def reload(self) -> None:
        self.services.clear()
        for p in sorted(self.policies_dir.glob("*.yaml")):
            with p.open() as f:
                data = yaml.safe_load(f)
            actions = {
                name: ActionSpec(name=name, **spec)
                for name, spec in data.get("actions", {}).items()
            }
            self.services[data["service"]] = ServiceSpec(
                name=data["service"],
                base_url=data["base_url"],
                actions=actions,
                notes=data.get("notes", ""),
            )

    def get_action(self, service: str, action: str) -> ActionSpec | None:
        svc = self.services.get(service)
        return svc.actions.get(action) if svc else None

    def list_services(self) -> list[dict[str, Any]]:
        return [
            {
                "service": s.name,
                "base_url": s.base_url,
                "action_count": len(s.actions),
                "actions": list(s.actions.keys()),
            }
            for s in self.services.values()
        ]

    def validate_args(self, action: ActionSpec, args: dict) -> list[str]:
        """Return list of validation error messages, or empty if valid."""
        errs = []
        provided = set(args.keys())
        required = set(action.required_args)
        allowed = required | set(action.optional_args)

        missing = required - provided
        if missing:
            errs.append(f"missing required args: {sorted(missing)}")

        extra = provided - allowed
        if extra:
            errs.append(f"unknown args: {sorted(extra)}")

        if action.allowed_query_prefixes and "query" in args:
            query = str(args.get("query", "")).lstrip().lower()
            prefixes = [p.lower() for p in action.allowed_query_prefixes]
            if not any(query.startswith(prefix) for prefix in prefixes):
                errs.append(
                    "query must start with one of: "
                    f"{sorted(action.allowed_query_prefixes)}"
                )

        return errs
