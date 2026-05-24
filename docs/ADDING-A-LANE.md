# ADDING-A-LANE.md

This is the public extension contract for AI Coding OS.

The system should stay provider-agnostic without becoming noisy. A new lane is
accepted only when it adds a distinct capability, has a health signal, declares
unsupported work, and routes through the existing capability registry.

## Decision Checklist

Add a lane only when all of these are true:

- The new lane is materially better at at least one named capability.
- The capability cannot be handled cleanly by an existing primary or fallback.
- The lane can be health-checked without exposing secrets.
- Credential handling is explicit: `none`, session-backed, keychain-backed, or TEL policy-bound.
- The lane has clear unsupported work so it cannot receive unsafe tasks.
- The lane improves quality, cost, safety, or proof. It is not added for novelty.

Reject the lane when:

- It duplicates an existing lane without a measurable win.
- It requires secrets in repo files, prompts, logs, or screenshots.
- It has no health check and would be marked `active`.
- It pushes model/provider details into the main cockpit surface.
- It adds visible orchestration complexity for routine users.

## Required Registry Fields

Each lane in `ai-lanes.json` needs:

- `id`: stable lowercase identifier.
- `role`: one-sentence operating role.
- `status`: `active`, `optional`, `study`, or `retired`.
- `capabilities`: capabilities the lane can actually own.
- `health`: executable or documented readiness signal.
- `fallbacks`: ordered fallback lanes, empty only when no fallback is valid.
- `unsupported`: task classes the lane must never receive.
- `hardFloor`: `true` only when the task cannot safely degrade.
- `credential`: credential class, not the credential value.
- `notes`: operational guidance for routing.

Each routed capability in `capabilities` needs:

- `primary`: lane id.
- `fallbacks`: ordered fallback lanes, or
- `noFallbackReason`: explanation for no fallback.

## Safe Example

```json
{
  "id": "example-lane",
  "role": "Example transform worker for safe text-only rewrites.",
  "status": "optional",
  "capabilities": ["example_safe_transform"],
  "health": {
    "kind": "command",
    "command": "command -v example-lane",
    "expect": "example-lane"
  },
  "fallbacks": ["codex"],
  "unsupported": ["credentialed_action", "payment_compliance", "destructive_action"],
  "hardFloor": false,
  "credential": "none",
  "notes": "Use only for safe text transforms; never route credentials or final QA here."
}
```

Route entry:

```json
"example_safe_transform": {
  "primary": "example-lane",
  "fallbacks": ["codex"]
}
```

## Verification

After editing `ai-lanes.json`, run:

```sh
cc-lane-registry-check
cc-lane route <capability>
cc-lane support <lane-id> <capability>
cc-lane-extension-check
cc-ai-checks
```

If the lane touches trust, credentials, browser auth, paid APIs, or destructive
actions, also run:

```sh
cc-trust-gate --check
cc-permission-matrix --check
cc-public-ci-check
```

## Cockpit Rule

Do not expose the new lane as another permanent control in the main cockpit.
The cockpit shows mission state and proof. Lane/provider details belong in
expanded diagnostics, receipts, or proof bundles.
