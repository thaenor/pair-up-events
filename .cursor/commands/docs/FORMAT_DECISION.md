# Agent File Format Decision

## Decision: Use Markdown for All Agent Files

**Date**: October 29, 2025  
**Status**: ✅ Implemented

---

## Format Comparison

### XML Format (Deprecated)

**Pros**:

- Structured metadata in tags
- Can embed markdown in CDATA sections
- Verbose but explicit

**Cons**:

- ❌ Verbose syntax (lots of tags)
- ❌ Harder to read and edit manually
- ❌ CDATA sections make markdown examples harder to maintain
- ❌ More complex to parse
- ❌ Inconsistent with orchestrator.md and documentation.md (Markdown)

### Markdown Format (Selected)

**Pros**:

- ✅ Human-readable and editable
- ✅ Easy to include code blocks and examples
- ✅ Consistent with rest of the system
- ✅ Better for version control diffs
- ✅ Natural language instructions are more intuitive
- ✅ Can still include structured metadata in YAML frontmatter or sections
- ✅ Better AI parsing (LLMs are optimized for markdown)

**Cons**:

- ⚠️ Less rigid structure (but markdown headings provide structure)
- ⚠️ Metadata less explicit (but can use YAML frontmatter)

### JSON Format (Considered)

**Pros**:

- Machine-readable
- Strict schema validation possible

**Cons**:

- ❌ Poor for long-form text instructions
- ❌ Hard to include code examples
- ❌ Not human-friendly for editing
- ❌ No comments support

---

## Migration Completed

- ✅ `reviewer.xml` → `reviewer.md`
- ✅ `qa.xml` → `qa.md`
- ✅ `orchestrator.md` already Markdown (no change)
- ✅ `documentation.md` already Markdown (no change)
- ✅ Updated `orchestrator.md` references

---

## Benefits Realized

1. **Consistency**: All agent files now use the same format
2. **Readability**: Much easier to read and edit agent instructions
3. **Maintainability**: Better for team collaboration and PR reviews
4. **Version Control**: Better diffs in git history
5. **AI Parsing**: Modern LLMs parse markdown more naturally
6. **Code Examples**: Natural code blocks without CDATA escapes

---

## Current Agent Files

All agent files are now in `.cursor/commands/`:

- `orchestrator.md` - Main orchestrator agent
- `reviewer.md` - Code review agent
- `qa.md` - QA testing agent
- `documentation.md` - Documentation agent

All documentation files moved to `.cursor/commands/docs/`
