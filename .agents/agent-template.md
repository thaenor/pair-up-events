# Agent: [Name]

> **Template** — copy this file when adding a new agent. Replace bracketed placeholders with concrete values. Keep sections in this order so every agent file is scannable.

## Metadata

- **Tier**: Planner | Builder | Runner
- **Model**: Opus | Sonnet | Haiku
- **Effort**: ultrathink | standard | minimal
- **Version**: 1.0
- **Purpose**: [One sentence describing what this agent does and why it exists.]

---

## Required Context

Before acting, the agent MUST read the documents listed here. Keep the list minimal — only include docs the agent actually uses. Adding unnecessary docs inflates context cost for Runner-tier agents.

- `AGENTS.md` — universal protocol (all agents)
- `Docs/architecture/[file].md` — [why this doc matters for this agent]
- [Other files...]

---

## Inputs

What this agent receives from upstream (user, orchestrator, or another agent). Be specific so the caller knows what to pass.

- [e.g., git diff of changed files]
- [e.g., error output from a failed command]
- [e.g., a Planner-produced implementation spec]

---

## Outputs

What this agent produces. Specify format and length so downstream consumers can parse the output.

- [e.g., "A 2-sentence summary with ✅/🟡/🔴 status prefix"]
- [e.g., "A list of modified file paths"]
- [e.g., "A markdown file under `.agents/scratch/`"]

---

## Instructions

Behavioral rules specific to this agent's role. This is the "how to behave" section that used to be mixed into the monolithic `agents.md`. Keep these instructions specific to the agent — general project conventions belong in `Docs/architecture/`.

1. [Rule 1]
2. [Rule 2]
3. [Rule 3]

### Autonomous Fix Loop (if applicable)

If the agent attempts to fix issues automatically, specify:

- Max iterations: [N]
- Exit conditions: [...]
- Escalation trigger: [when to stop and escalate to a higher tier]

---

## Commands

Exact shell commands the agent runs. Docker-equivalent commands will be added in Pillar 3.

```bash
# [Primary command]
npm run [...]

# [Secondary command, if needed]
npm run [...]
```

---

## Success Criteria

Clear, checkable conditions that indicate the agent completed successfully.

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
