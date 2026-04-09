# E2E Agent (Cursor wrapper)

> **This is a thin wrapper.** The canonical agent definition lives at `.agents/builder/e2e-agent.md`. Cursor's `/e2e-agent` command delegates here.

## Action

Read `.agents/builder/e2e-agent.md` and execute the Playwright E2E suite + failure analysis + fix loop as described there. This is a Builder-tier (Sonnet / standard) agent.

### Prerequisites (manual)

E2E tests require three processes running in separate terminals:

1. `npm run build`
2. `npm run preview` (port 8080)
3. `npm run emulator:start` (Firebase Auth emulator, port 9099)

Pillar 3 (Docker) will collapse these into a single `docker compose` invocation.
