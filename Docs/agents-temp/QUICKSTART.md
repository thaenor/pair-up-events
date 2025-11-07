# Quick Start: Using @prompt-generator

## What is @prompt-generator?

A Cursor command that transforms rough feature requests into detailed, context-rich implementation specifications. It acts as both a Product Manager and Senior Engineer to refine your ideas.

## Basic Usage

### Option 1: Generate Implementation Prompt

When you're ready to start work immediately:

```
@prompt-generator Please add dark mode toggle to settings
```

**Output**: Creates `Docs/agents-temp/prompt-[timestamp]-add-dark-mode-toggle.md` with:

- Refined requirements and acceptance criteria
- Technical context from codebase analysis
- Implementation steps
- Testing requirements
- Complexity estimate

### Option 2: Add to Backlog

When you want to track the task for later:

```
@prompt-generator --backlog Please add dark mode toggle to settings
```

**Output**: Adds structured entry to `Docs/Backlog.md` with research, complexity, and impact analysis.

## How It Works

### Phase 1: Clarification (PM Persona)

The agent asks questions to clarify:

- Scope and boundaries
- User-facing goals
- Edge cases
- Technical requirements

**You respond**, then it proceeds to Phase 2.

### Phase 2: Context Building (Engineer Persona)

The agent analyzes:

- Existing code patterns
- Data models and types
- Similar implementations
- Architectural constraints

### Phase 3: Output Generation

Creates either:

- **Detailed prompt file** → Ready for immediate implementation
- **Backlog entry** → Prioritized task with research notes

## Example Session

**You type**:

```
@prompt-generator Remove the email field from user profiles
```

**Agent asks** (batched questions):

```
I need to clarify:
1. Remove from UI only, or also from Firestore schema?
2. How to handle existing users with email data?
3. Should authentication still use email?
4. Any migration strategy needed?
```

**You respond**:

```
1. UI only, keep in Firestore for auth
2. Keep the data, just don't display it
3. Yes, auth still uses email
4. No migration needed
```

**Agent generates**:

```
✅ Requirements Defined
- User Story: As a user, I want my email private...
- Acceptance Criteria: [detailed list]

🔨 Context Analysis
- Complexity: Simple (2-3 files)
- Affected: profile.tsx, user display components

📄 Generated Prompt
Saved to: Docs/agents-temp/prompt-2025-11-07-hide-email-field.md
```

## Tips for Best Results

### Be Specific About Intent

❌ "Fix the login"
✅ "Add loading spinner to login button during authentication"

### Mention Context If Known

❌ "Add a filter"
✅ "Add date range filter to events list page"

### Flag Architecture Concerns

If the agent detects suboptimal patterns, it will:

1. Stop and explain the concern
2. Suggest alternatives
3. Wait for your decision

### Use --backlog for Planning

- Early-stage ideas
- Tasks needing prioritization
- Long-term improvements

## What Happens Next?

### If you generated a prompt file:

1. Review the generated prompt in `Docs/agents-temp/`
2. Pass it to Composer or implement manually
3. Delete the temp file after completion

### If you added to backlog:

1. Review the backlog entry in `Docs/Backlog.md`
2. Prioritize with team
3. Use `@prompt-generator [backlog item]` when ready to implement

## Files Created by This Agent

```
.cursorrules                                      # Command definition
Docs/agents-temp/README.md                        # Directory purpose
Docs/agents-temp/QUICKSTART.md                    # This file
Docs/agents-temp/EXAMPLE-*.md                     # Example output
Docs/agents-temp/prompt-[timestamp]-[task].md     # Your generated prompts
```

## Related Documentation

- **Agent Rules**: `Docs/agents.md` (Section 12)
- **Command Definition**: `.cursorrules`
- **Example Output**: `Docs/agents-temp/EXAMPLE-prompt-2025-11-07-sample-task.md`
- **Backlog Format**: `Docs/Backlog.md`

---

**Questions?** Check `.cursorrules` for full command documentation.
