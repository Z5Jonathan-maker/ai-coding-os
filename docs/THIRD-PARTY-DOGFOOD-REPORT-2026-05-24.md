# THIRD-PARTY-DOGFOOD-REPORT-2026-05-24.md

This is the first third-party public-repo dogfood proof for AI Coding OS.

## Session

- Session ID: `third-party-dogfood-proof-20260524T115307Z`
- Source: `https://github.com/jonschlinkert/is-odd.git`
- Pinned ref: `a80ee0d831a8ee69f1fad5b4673491847975eb26`
- Finished: `2026-05-24T11:53:10Z`
- Local evidence directory:
  `~/.Codex/third-party-dogfood/third-party-dogfood-proof-20260524T115307Z/`

## Result

```text
ok   Clone third-party repository
ok   Initial failing test captured
ok   Runtime repair and Mission Events
ok   PR-quality score
ok   Review and local commit
ok   Third-party tests after mutation

passed=5 failed=0
commit=4b042e5
Status: third-party-dogfood-passed
```

## Commit

```text
4b042e5 dogfood: support bigint odd checks
```

This commit exists in the isolated third-party clone on branch:

```text
dogfood/third-party-dogfood-proof-20260524T115307Z
```

## Mutated Files

```text
index.js | 4 ++++
test.js  | 7 +++++++
2 files changed, 11 insertions(+)
```

## Patch Summary

The task introduced a failing BigInt test against the external package, then
repaired `isOdd` to support:

- positive BigInt inputs
- even BigInt inputs
- negative BigInt inputs

The final third-party clone passed:

```text
npm test
4 passing
```

## Interpretation

This proof is stronger than the self-clone public-repo proof because it starts
from an unrelated public repository, pins upstream source, mutates tracked
third-party files, validates Mission Events, commits locally, and reruns that
project's own test gate after the mutation.

It now also has a reusable PR-quality scorer. It still does not claim arbitrary
issue resolution. The next stronger proof is an externally sourced issue
captured from a real upstream tracker and scored with the same gate.
