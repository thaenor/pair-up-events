# QA Agent (Cursor wrapper)

> **This is a thin wrapper.** The canonical agent definition lives at `.agents/reviewer/qa.md`. Cursor's `/qa` command delegates here.

## Action

Read `.agents/reviewer/qa.md` and execute the full CI validation + autonomous fix loop as described there. This is a split-tier agent:

- **Planner (Opus)** for classification, memory check, and consolidated reporting
- **Runner (Haiku)** for the mechanical fixes delegated to lint/type/unit/build runners
