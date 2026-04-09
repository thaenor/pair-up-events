# Docker Commands for Agents

**Pillar 3**: Every command an agent runs executes inside a container. Nothing except the editor / agent orchestrator runs on bare metal.

All commands below assume you are in the repository root. They use the profiles defined in `docker-compose.yml`.

---

## Quick Reference

| Task               | Tier    | Command                                                                   |
| ------------------ | ------- | ------------------------------------------------------------------------- |
| Dev server         | —       | `docker compose --profile dev up`                                         |
| Lint (check)       | Runner  | `docker compose --profile lint up --exit-code-from lint`                  |
| Lint (fix)         | Runner  | `docker compose --profile lint-fix up --exit-code-from lint-fix`          |
| Typecheck          | Runner  | `docker compose --profile typecheck up --exit-code-from typecheck`        |
| Unit tests         | Runner  | `docker compose --profile test up --exit-code-from test-unit`             |
| Build              | Runner  | `docker compose --profile build up --exit-code-from build`                |
| Full CI (parallel) | Runner  | `docker compose --profile ci up --exit-code-from build`                   |
| E2E                | Builder | `docker compose --profile dev --profile e2e up --exit-code-from test-e2e` |
| Firebase emulators | —       | `docker compose --profile emulator up`                                    |

Add `--build` after `up` on the first run or whenever `package.json` / a Dockerfile changes.

---

## Dev Server

Starts Vite on `http://localhost:5173` with hot reload. Bind mount keeps source edits live.

```
docker compose --profile dev up
```

Stop with `Ctrl+C` or, in another terminal:

```
docker compose --profile dev down
```

---

## Individual Quality Gates (Runner Tier)

Each of these runs a single check and exits. Use `--exit-code-from <service>` so CI (or an agent's shell) sees a non-zero exit on failure.

```
# Format check + lint (non-destructive)
docker compose --profile lint up --exit-code-from lint

# Format + lint --fix (writes to disk via bind mount)
docker compose --profile lint-fix up --exit-code-from lint-fix

# tsc --noEmit
docker compose --profile typecheck up --exit-code-from typecheck

# vitest run
docker compose --profile test up --exit-code-from test-unit

# vite build (validates prod bundle)
docker compose --profile build up --exit-code-from build
```

---

## Parallel CI

The `ci` profile includes `lint`, `typecheck`, `test-unit`, and `build`. Docker Compose starts them concurrently; use `--exit-code-from build` to block on the slowest one and propagate its exit code.

```
docker compose --profile ci up --exit-code-from build
```

This maps 1:1 to the DAG Phase 1a/1b/1c in `.agents/orchestrator.md` — lint, typecheck, and unit tests run in parallel, then build runs once they pass.

---

## E2E Tests (Builder Tier)

Playwright needs a running dev server. The `test-e2e` service declares `depends_on: [dev]`, so selecting both profiles starts them in order.

```
docker compose --profile dev --profile e2e up --exit-code-from test-e2e
```

The E2E image (`Dockerfile.e2e`) is based on `mcr.microsoft.com/playwright` and already ships Chromium + system deps. Test results land in the `e2e-results` named volume.

---

## Firebase Emulators

Auth, Firestore, Storage, and the Emulator UI. Ports `9099` / `8080` / `9199` / `4000`.

```
docker compose --profile emulator up
```

`Dockerfile.firebase` is Alpine + `openjdk17-jre-headless` + `firebase-tools` (the emulators require a JRE).

---

## Full Local Pipeline

Runner-tier gates, then E2E:

```
docker compose --profile ci up --exit-code-from build \
  && docker compose --profile dev --profile e2e up --exit-code-from test-e2e
```

---

## Maintenance

Every service in this project is gated behind a Compose profile, so a bare `docker compose build` prints `WARN[0000] No services to build` and exits without doing anything. You have to activate the profiles you want built.

```
# Rebuild all three images (dev/ci/e2e/emulator) after package.json or a Dockerfile changes
docker compose --profile dev --profile ci --profile e2e --profile emulator build

# Equivalent via env var
COMPOSE_PROFILES=dev,ci,e2e,emulator docker compose build

# In practice you rarely need an explicit build — `up` builds on demand the first time.

# Wipe the named node_modules volume (forces fresh install on next up)
docker compose down -v

# Prune dangling images
docker image prune -f
```

---

## Escape Hatch

If Docker is genuinely unavailable (CI sandbox restrictions, container runtime failure, etc.), bare-metal `npm` commands are still defined in `package.json` as a fallback. Document any such exception in the agent's report and flag it for human review — drifting from Docker-first breaks the dev/CI parity guarantee.
