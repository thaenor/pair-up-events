# Agent Reports Directory

This directory contains unresolved issue reports created by the QA agent.

## Purpose

When the QA agent encounters complex issues that cannot be automatically fixed, it creates detailed reports here. These reports serve as:

1. **Long-term memory** - Issues persist between agent runs
2. **Orchestrator handoff** - Complex issues are documented for the orchestrator or developer
3. **Progress tracking** - Reports are automatically cleaned up when issues are resolved

## Report Lifecycle

1. **Creation**: QA agent creates a report when it encounters a complex issue
2. **Memory Check**: QA agent checks this folder on each run and attempts to fix reported issues
3. **Resolution**: When `npm run ci` passes successfully, all reports are automatically deleted

## Report Naming

- Format: `qa-issue-YYYY-MM-DD-HHMMSS.md` or `qa-issue-{descriptive-name}.md`
- Example: `qa-issue-2025-10-29-142530.md` or `qa-issue-test-failure-auth.tsx.md`

## File Structure

Each report contains:

- Issue summary
- CI error output
- Root cause analysis
- Affected files
- Required fix steps
- Complexity assessment
- Suggested approach

## Manual Cleanup

If you manually fix an issue, you can delete its report file. The QA agent will verify the fix on the next run.
