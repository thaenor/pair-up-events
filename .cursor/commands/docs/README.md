# Commands Documentation - Quick Navigation

> **Start here** for a complete guide to the orchestrator system and all agent commands.

---

## 🚀 Quick Start

**New to the system?** Read in this order:

1. **[This README](#)** (5 min) - Overview
2. **[orchestrator-usage.md](./orchestrator-usage.md)** (5 min) - How to use
3. **[SUMMARY.md](./SUMMARY.md)** (3 min) - Current state summary

---

## 📋 Available Commands

### Main Command: `@orchestrator`

Runs the full 3-phase pipeline:

1. **Code Review** (`reviewer.md`) - Quality analysis
2. **QA & Testing** (`qa.md`) - Test validation + autonomous fixing
3. **Documentation** (`documentation.md`) - Updates docs

### Individual Agents

- `@reviewer` - Code quality review only
- `@qa` - Testing validation + autonomous fixing
- `@documentation` - Documentation updates only

---

## 📚 Documentation Files

### Essential Reading

- **[SUMMARY.md](./SUMMARY.md)** - Current system state and features
- **[INDEX.md](./INDEX.md)** - Complete documentation index
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Quick start guide
- **[orchestrator-usage.md](./orchestrator-usage.md)** - Usage guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

### Technical Details

- **[orchestrator-implementation.md](./orchestrator-implementation.md)** - Implementation details
- **[ORCHESTRATOR_SUMMARY.md](./ORCHESTRATOR_SUMMARY.md)** - Deliverables summary

### Reference / Historical

- **[FORMAT_DECISION.md](./FORMAT_DECISION.md)** - XML → Markdown migration
- **[ORGANIZATION_SUMMARY.md](./ORGANIZATION_SUMMARY.md)** - Folder organization
- **[QA_AGENT_ENHANCEMENT.md](./QA_AGENT_ENHANCEMENT.md)** - QA v3.0 features
- **[AGENT_ENHANCEMENTS_SUMMARY.md](./AGENT_ENHANCEMENTS_SUMMARY.md)** - Agent enhancements
- **[REVIEWER_ENHANCEMENTS.md](./REVIEWER_ENHANCEMENTS.md)** - Reviewer enhancements
- **[QA_ENHANCEMENTS.md](./QA_ENHANCEMENTS.md)** - QA enhancements (pre-v3.0)
- **[DOCUMENTATION_ENHANCEMENTS.md](./DOCUMENTATION_ENHANCEMENTS.md)** - Documentation enhancements

---

## 🎯 Key Features

### Orchestrator

- Coordinates 3-phase pipeline
- Generates comprehensive reports
- Passes context between agents

### Reviewer Agent (v2.0)

- React/TypeScript/Firestore-specific checks
- 8 analysis categories
- Code health scoring

### QA Agent (v3.0) ⚡

- **Autonomous Fixing** - Auto-fixes easy issues
- **Memory System** - Remembers unresolved issues
- **CI Validation** - Runs `npm run ci`
- **Report Generation** - Documents complex issues

### Documentation Agent (v2.0)

- CHANGELOG.md updates
- Component tree map
- JSDoc validation
- ADRs

---

## 📁 File Locations

**Active Agents**: `.cursor/commands/`

- `orchestrator.md`
- `reviewer.md`
- `qa.md`
- `documentation.md`

**Documentation**: `.cursor/commands/docs/` (this folder)

---

## 🆕 Recent Changes (October 2025)

- ✅ QA agent enhanced with autonomous fixing (v3.0)
- ✅ All agents converted to Markdown format
- ✅ Documentation organized into `docs/` folder
- ✅ References updated across all files

---

**See [SUMMARY.md](./SUMMARY.md) for complete system overview.**
