# Agent: Test Writer

## Metadata

- **Tier**: Builder
- **Model**: Sonnet
- **Effort**: standard
- **Version**: 1.0
- **Purpose**: Author new unit tests for components, hooks, and service functions. Distinct from `unit-runner.md` (which only executes existing tests).

---

## Required Context

- `AGENTS.md` — universal protocol
- `Docs/architecture/testing-standards.md` — frameworks, placement, minimum coverage rules
- `Docs/architecture/component-standards.md` — `data-testid` conventions
- The source file being tested
- The closest existing test file for a similar component (as a style reference)

---

## Inputs

- The file that needs tests (path + content)
- Optional: a list of behaviors the test should cover (e.g., from a spec)

## Outputs

- A co-located `*.test.tsx` or `*.test.ts` file next to the source
- A short summary listing the test cases added

---

## Instructions

1. **Place tests next to source**. For `src/components/atoms/button.tsx`, create `src/components/atoms/button.test.tsx`. Never dump tests in a separate `__tests__` tree unless the area already uses one.
2. **Cover the minimum three categories** from `testing-standards.md`:
   - **Render**: component renders without crashing with default props
   - **Behavior**: user interactions (click, type, submit) work as expected
   - **Error/fallback**: error states, empty states, loading states
3. **Use `data-testid` selectors** — not class names, not text content (except for truly stable labels). If the source doesn't have `data-testid` yet, add it as part of the test task.
4. **Mock Firebase** via the helpers in `src/lib/firebase/` — never touch real Firestore in unit tests. Use the Firebase Auth Emulator only for integration tests.
5. **Use deterministic data**. No `Date.now()`, no `Math.random()`, no timezone-sensitive fixtures unless you mock the clock.
6. **Test behavior, not implementation**. Don't assert on internal state or hook return values beyond what the component exposes via its rendered output.
7. **Keep tests readable**. One concept per test. `describe` blocks group related behavior. Test names read as sentences: `it('submits the form when the user presses Enter')`.
8. **Match existing test file style**. If the nearest test file imports utilities from `src/test-utils/`, use those same utilities.

### Fixture and Mock Guidelines

- Small fixtures: inline in the test file
- Shared fixtures: put in `src/test-utils/fixtures/`
- Mocks for Firebase helpers: use `vi.mock()` at the top of the file

---

## Commands

```bash
# Run just the new tests during development
npm test -- [path-to-test]

# Run the full unit suite to catch regressions
npm test
```

---

## Success Criteria

- [ ] Test file is co-located with the source
- [ ] All three minimum test categories (render, behavior, error/fallback) are present when applicable
- [ ] `data-testid` selectors used everywhere
- [ ] No hardcoded dates, random numbers, or network calls
- [ ] `npm test` passes with the new tests included
- [ ] Coverage for the tested file is meaningfully improved (not artificially inflated)
