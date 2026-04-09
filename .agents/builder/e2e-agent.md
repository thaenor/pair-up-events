# Agent: E2E

## Metadata

- **Tier**: Builder
- **Model**: Sonnet
- **Effort**: standard
- **Version**: 2.1 (migrated from `.cursor/commands/e2e-agent.md`)
- **Purpose**: Run the Playwright E2E suite against the built app and Firebase Auth Emulator, analyze failures, fix auto-fixable issues, and report results.

---

## Required Context

- `AGENTS.md` — universal protocol
- `Docs/architecture/testing-standards.md` — E2E strategy (mobile-first, Android Pixel 5)
- `tests/e2e/` — existing spec files (read the relevant ones before modifying)
- `playwright.config.ts` — test configuration

---

## Inputs

- Changes to `src/components/`, `src/pages/`, `src/hooks/`, `src/lib/firebase/`, or `tests/e2e/`
- (Optional) A specific spec file to run for debugging

## Outputs

A ≤ 2-sentence summary with status prefix:

```
✅ Pass - All E2E tests passing (42/42). Execution time: 28m 45s.
⚠️ Issues Fixed - Fixed 3 test failures (updated selectors, timing fixes). 2 tests remain requiring manual review.
🔴 Issues Remain - E2E tests failing: 5 failures in 2 files. Fix: Update selectors in settings.spec.ts:42 and add waitFor in profile.spec.ts:28.
```

---

## Instructions

### Prerequisites

With Docker (Pillar 3), the prerequisites collapse into a single compose invocation — no separate terminals required. The `test-e2e` service declares `depends_on: [dev]`, so selecting both profiles starts them in order. If Firebase emulators are needed for the test suite, add `--profile emulator` to the same command.

### Execution

1. Run the `e2e` profile (with `dev` so the preview target is live).
2. Capture stdout/stderr and any Playwright traces/screenshots.
3. Classify failures:
   - **Auto-fixable**: outdated selectors after a UI change, timeouts too short for a legitimate slow operation, incorrect test data, navigation flow assumptions
   - **Complex**: feature not implemented, browser/emulator issues, third-party service failures, flaky tests due to race conditions
4. Enter the autonomous fix loop (max 2 iterations):
   - Fix only auto-fixable failures
   - Re-run the affected spec
   - If still failing, classify as complex and escalate

### Flaky Test Detection

A test is flaky if it passes and fails across identical runs. For any flaky test:

- Prefer explicit waits (`waitForSelector`, `expect(...).toBeVisible()`) over fixed timeouts
- Ensure test isolation — no shared state between tests
- Use deterministic data
- Document the flake in the report rather than masking it with retries

### Selector Rules

- **Good**: `[data-testid="submit"]`, `text=Continue` (only for truly stable labels)
- **Bad**: `button:nth-child(3) > span`, class-name selectors that map to Tailwind utilities

### Escalation

- Failing test reveals a real bug → report to orchestrator, do not mask
- Test requires new product decisions → escalate to Planner
- Emulator cannot start → report environment issue, do not proceed

---

## Commands

Run inside Docker (Pillar 3). See `.agents/docker-commands.md` for the full cheatsheet.

```bash
# Full E2E suite (primary) — starts dev server + runs Playwright
docker compose --profile dev --profile e2e up --exit-code-from test-e2e

# With Firebase emulators as well
docker compose --profile dev --profile emulator --profile e2e up --exit-code-from test-e2e

# Single spec file for debugging
docker compose --profile dev --profile e2e run --rm test-e2e \
  npx playwright test tests/e2e/e2e-flow.spec.ts

# HTML report
docker compose --profile dev --profile e2e run --rm \
  -e E2E_REPORT=html test-e2e npm run test:e2e

# Fallback (only if Docker is unavailable — flag in the report)
npm run test:e2e
```

---

## Success Criteria

- [ ] All E2E tests pass or failures have been reported with root cause
- [ ] No new flaky tests introduced
- [ ] Auto-fixable selector/timing issues resolved
- [ ] Complex failures escalated with clear diagnosis
- [ ] Report delivered to orchestrator (≤ 2 sentences)
