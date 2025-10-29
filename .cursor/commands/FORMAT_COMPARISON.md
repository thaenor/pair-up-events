# Agent File Format Comparison

## Current State

- `reviewer.xml`: XML format (546 lines)
- `qa.xml`: XML format (781 lines)
- `documentation.md`: Markdown format (931 lines)

## Format Analysis

### XML Format (Current for Reviewer & QA)

**Pros:**

- ✅ Structured metadata in tags
- ✅ Can embed markdown in CDATA sections
- ✅ Verbose but explicit

**Cons:**

- ❌ Verbose syntax (lots of tags)
- ❌ Harder to read and edit manually
- ❌ CDATA sections make markdown examples harder to maintain
- ❌ More complex to parse
- ❌ Inconsistent with orchestrator.md and documentation.md (Markdown)

### Markdown Format (Current for Documentation & Orchestrator)

**Pros:**

- ✅ Human-readable and editable
- ✅ Easy to include code blocks and examples
- ✅ Consistent with rest of the system
- ✅ Better for version control diffs
- ✅ Natural language instructions are more intuitive
- ✅ Can still include structured metadata in YAML frontmatter or sections
- ✅ Better AI parsing (LLMs are optimized for markdown)

**Cons:**

- ⚠️ Less rigid structure (but markdown headings provide structure)
- ⚠️ Metadata less explicit (but can use YAML frontmatter)

### JSON Format (Not Currently Used)

**Pros:**

- ✅ Machine-readable
- ✅ Strict schema validation possible

**Cons:**

- ❌ Poor for long-form text instructions
- ❌ Hard to include code examples
- ❌ Not human-friendly for editing
- ❌ No comments support

## Recommendation: **Markdown**

**Reasons:**

1. **Consistency**: Already using Markdown for orchestrator.md and documentation.md
2. **AI Parsing**: Modern LLMs parse markdown more naturally than XML
3. **Maintainability**: Easier to read, edit, and review
4. **Collaboration**: Better for team collaboration and PR reviews
5. **Version Control**: Better diffs in git
6. **Code Examples**: Natural code blocks without CDATA escapes

**Migration Strategy:**

- Convert reviewer.xml → reviewer.md
- Convert qa.xml → qa.md
- Preserve all functionality
- Update orchestrator.md references
