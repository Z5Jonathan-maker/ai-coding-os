# CODE-HARVEST-WORKFLOW.md

Use this when studying open-source AI IDEs, agents, routers, browser tools, or
desktop apps for code we can adapt into the AI cockpit.

## Principle

The target is not novelty. The target is best-in-class execution of our existing
direction:

```text
VS Code cockpit -> router -> opinionated lanes -> visible control -> verified output
```

Reference projects can supply mature implementation pieces, but they do not get
to redefine the product.

## Harvest Gate

Do not copy or vendor code unless every gate passes:

1. **Named gap:** The code fills a specific gap already documented in the
   cockpit/router/lane system.
2. **Best-in-class:** The project is widely used, actively maintained, or clearly
   one of the strongest implementations of that capability.
3. **Clean fit:** The code can become a module, command, component, or library
   inside our architecture without adding a duplicate IDE, duplicate assistant
   shell, or extra model lane.
4. **License clear:** The license permits our intended use and redistribution.
   GPL/AGPL code requires explicit approval before import.
5. **Small surface:** The imported piece has a narrow boundary and does not drag
   in a large unrelated runtime.
6. **Replaceable:** We can remove or rewrite it later without breaking the
   cockpit's core routing model.
7. **Verified:** The piece has a test, smoke command, or cockpit-visible proof
   after integration.

If any gate fails, harvest the idea and rebuild natively.

## Candidate Gap Classes

These are the kinds of pieces worth looking for in top projects:

- diff review UI and patch application flow
- checkpoint/restore visualization
- approval policy UI
- long-running job supervision
- worktree/session isolation
- repo indexing and context packing
- prompt preset/skill management
- token/cost accounting widgets
- terminal command streaming UI
- browser/operator bridge health
- local file attachment and context pruning
- route receipt and model fallback visualization

## Harvest Record

Every candidate gets a short record before code moves:

```md
## <project> / <component>

- Gap:
- Source:
- License:
- Maintenance signal:
- Files/modules considered:
- Fit score: /10
- Risk:
- Decision: import | adapt | rebuild | reject
- Verification command:
```

## Import Rules

- Prefer small files/modules over whole packages.
- Preserve license headers.
- Add attribution when required.
- Wrap imported code behind our command/component boundary.
- Rename concepts to match our vocabulary only after behavior is understood.
- Do not mix behavior changes with cosmetic rewrites in the same patch.
- Add the new command/component to `docs/COMMAND-REGISTRY.md` or cockpit docs
  when it becomes an active surface.

## Quality Bar

Harvested code must make the system feel more polished, not more complicated.
The final result should look like it was always part of this cockpit.
