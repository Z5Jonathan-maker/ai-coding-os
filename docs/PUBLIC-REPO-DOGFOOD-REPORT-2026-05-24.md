# PUBLIC-REPO-DOGFOOD-REPORT-2026-05-24.md

This is the first larger public-repo dogfood proof for AI Coding OS.

## Session

- Session ID: `public-repo-dogfood-proof-20260524T025228Z`
- Source: `https://github.com/Z5Jonathan-maker/ai-coding-os.git`
- Finished: `2026-05-24T02:52:32Z`
- Local evidence directory:
  `~/.Codex/public-repo-dogfood/public-repo-dogfood-proof-20260524T025228Z/`

## Result

```text
ok   Clone public repository
ok   Initial failing test captured
ok   Runtime repair and Mission Events
ok   Review and local commit
ok   Public repo gates after mutation

passed=5 failed=0
commit=89d91aa
Status: public-repo-dogfood-passed
```

## Commit

```text
89d91aa dogfood: repair demo fixture discount handling
```

This commit exists in the isolated public clone on branch:

```text
dogfood/public-repo-dogfood-proof-20260524T025228Z
```

## Mutated Files

```text
fixtures/demo-project/src/math.js      | 7 +++++--
fixtures/demo-project/src/math.test.js | 2 ++
2 files changed, 7 insertions(+), 2 deletions(-)
```

## Patch Summary

The task introduced a failing discount test against the public demo fixture,
then repaired `quoteTotal` to support:

- legacy numeric tax-rate calls
- object options
- `discountRate`
- `taxRate`

The final public clone passed:

```text
cc-public-ci-check
passed=11 failed=0
```

## Interpretation

This proof is stronger than the isolated mutating fixture because it starts
from a fresh public clone, creates a branch, mutates tracked project files,
validates Mission Events, commits locally, and runs the public CI gate after
the mutation.

It still does not claim arbitrary open-source issue resolution. The next
stronger proof is an externally sourced issue or failing test from a third-party
public repository with a merge-ready patch.
