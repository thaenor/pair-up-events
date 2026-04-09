# Agent: Build Validator

## Metadata

- **Tier**: Runner
- **Model**: Haiku
- **Effort**: minimal
- **Version**: 2.0 (migrated from `.cursor/commands/build-agent.md`)
- **Purpose**: Run the production Vite build, verify success, report bundle size, and flag regressions.

---

## Required Context

- `AGENTS.md` (escalation rules only)
- `vite.config.ts` only if the build output references a config issue

---

## Inputs

- The current state of the working tree (tests and type-check should already be passing)

## Outputs

A ≤ 2-sentence summary:

```
✅ Pass - Build successful. Bundle size: 185 KB (58 KB gzipped).
⚠️ Bundle Size Warning - Build successful but main bundle increased to 220 KB (above 200 KB threshold). Fix: Implement route-based code splitting or remove unused dependencies.
🔴 Build Failed - Build failed with X errors. Fix: [brief proposal]
```

---

## Instructions

1. Run the build container. Capture stdout/stderr and exit code.
2. If build fails:
   - Classify the error:
     - **Auto-fixable**: missing env var reference, unused import causing tree-shaking warning, simple asset reference error
     - **Complex**: circular dependency, third-party dependency issue, Vite config problem, memory/performance regression
   - Do NOT attempt to fix complex errors — escalate.
3. If build succeeds, collect bundle stats from `dist/`:
   - Main bundle size (raw + gzipped)
   - Vendor bundle size
   - CSS bundle size
4. Compare against these thresholds (gzipped main bundle):
   - `< 100 KB`: ✅ excellent
   - `100–150 KB`: 🟢 good
   - `150–200 KB`: 🟡 acceptable
   - `> 200 KB`: 🔴 investigate
5. Report the result. Do NOT suggest code-splitting refactors — that's a Planner concern.

### Escalation Rules

- Circular dependency detected → Planner
- Vite config error → Planner
- Bundle size exceeds 200 KB gzipped → Planner (bundle analysis + code-splitting decision)
- Third-party dependency breaks build → Planner

---

## Commands

Run inside Docker (Pillar 3). See `.agents/docker-commands.md` for the full cheatsheet.

```bash
# Primary
docker compose --profile build up --exit-code-from build

# Fallback (only if Docker is unavailable — flag in the report)
npm run build
```

---

## Success Criteria

- [ ] Build container exits with code 0, OR failure is classified and escalated
- [ ] Bundle size reported in the summary
- [ ] Threshold warnings flagged
- [ ] No Vite config changes made by this agent
- [ ] Summary returned in the prescribed format
