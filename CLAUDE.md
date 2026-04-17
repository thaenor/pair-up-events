@README.md

## Agent Workflow

Four specialized sub-agents live in `.claude/agents/`. Invoke them with `/agent <name>`.

### Agents

| Agent               | File                                  | Responsibility                                                      |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| `frontend-designer` | `.claude/agents/frontend-designer.md` | All visual/UI changes — components, layout, Tailwind, animations    |
| `senior-architect`  | `.claude/agents/senior-architect.md`  | Data model, Firestore optimization, code organization, PR reviews   |
| `qa-engineer`       | `.claude/agents/qa-engineer.md`       | Lint, typecheck, unit tests, E2E tests, Playwright visual debugging |
| `security-reviewer` | `.claude/agents/security-reviewer.md` | Firestore/Storage rules, auth flows, context security audit         |

### Mandatory gate order for UI/feature tasks

```
User request
  └─> frontend-designer   (UI changes + handoff note)
        └─> senior-architect  (code review + sign-off)
              └─> security-reviewer  (if rules/auth/context touched)
                    └─> qa-engineer  (full test suite + QA report)
```

For pure refactors or data-model changes, start with `senior-architect` directly.
For test-only fixes, start with `qa-engineer` directly.

### Bundle size gate

```bash
npm run check:size   # build + gzip analysis; warns > 150 KB, fails > 200 KB
```

Run this before any PR that adds dependencies or new pages.
