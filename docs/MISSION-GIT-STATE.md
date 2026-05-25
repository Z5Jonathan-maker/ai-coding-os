# Mission Git State

`cc-mission-git` records each mission phase as a Git commit under
`refs/cc-missions/<mission>/<phase>`.

It does not move `HEAD` and it does not touch the real index. The commit body
stores the mission status, phase status, proof verdict, event count, repo head,
and dirty count. This keeps receipts in files while making Git the durable
ledger for phase transitions.

Reference pattern studied: Aider's auto-commit discipline.

## Commands

```bash
cc-mission-git record --repo . --mission demo --phase codex_proof --dir .ai/design-handoffs/demo
cc-mission-git log --repo . --mission demo
cc-mission-git show --repo . --mission demo --phase codex_proof
```

`cc-design-handoff execute` records the handoff repo automatically. During
`kimi_implementation --target-repo <repo>`, it also records the target repo.
