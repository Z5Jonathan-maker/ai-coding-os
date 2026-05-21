## What changed

-

## Why

-

## Verification

Run the narrowest relevant check first, then the full gate before release work:

```sh
cc-release-check
```

Paste the summary line:

```text
passed=__ failed=__
```

## Boundaries

- [ ] No secrets, tokens, local credentials, or private account data were added.
- [ ] No retired command or obsolete routing path was reintroduced.
- [ ] Browser-mode limitations remain explicit if browser behavior changed.
- [ ] Public docs still describe what is actually wired today.
