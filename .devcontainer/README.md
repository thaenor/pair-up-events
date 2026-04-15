# Dev Container — pair-up-events

This directory configures a self-contained development environment using
[Dev Containers](https://containers.dev/). All project dependencies
(`node_modules`, Firebase emulator JARs, Playwright browser binaries) live
**inside the container** and never touch your host machine.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Docker Desktop (or Docker Engine) | ≥ 24 | Must be running |
| VS Code | any | + [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) |

Alternatively, use the **GitHub Codespaces** button — no local Docker needed.

---

## Quick Start

### Option A — VS Code

1. Open the repo folder in VS Code.
2. When prompted *"Reopen in Container"*, click it.
   (Or open Command Palette → **Dev Containers: Reopen in Container**).
3. VS Code will build the image, start the container, install `npm` packages
   and Playwright browsers automatically (`postCreateCommand`).
4. Open a terminal inside VS Code and run your usual scripts:

```bash
# Start the Vite dev server (accessible at http://localhost:5173)
npm run dev

# In a second terminal — start Firebase emulators
npm run emulator:start

# Firebase Emulator UI: http://localhost:4000
```

### Option B — Docker Compose (no VS Code)

```bash
# Build and start the container
docker compose -f .devcontainer/docker-compose.yml up -d --build

# Open a shell inside the container
docker compose -f .devcontainer/docker-compose.yml exec app bash

# Inside the container shell:
npm install
npm run dev
```

---

## Environment Variables

Copy `.devcontainer/.env.example` to `.env.local` in the project root and
adjust if needed:

```bash
cp .devcontainer/.env.example .env.local
```

For local development with emulators the defaults work without any Firebase
credentials. Only `npm run dev:live` (pointing at a real Firebase project)
requires real API keys.

---

## Port Map

| Port | Service |
|------|---------|
| 5173 | Vite dev server |
| 4000 | Firebase Emulator UI |
| 8081 | Firestore emulator |
| 9099 | Auth emulator |
| 9199 | Storage emulator |
| 9150 | Firestore WebChannel |

---

## What's Isolated (Not on Host)

- `node_modules` — stored in a named Docker volume, never written to your disk
- Playwright browser binaries — installed inside the container image
- Firebase emulator JARs — downloaded inside the container
- Java (OpenJDK 17) — only inside the container
- `firebase-tools` global CLI — only inside the container

## Resetting the Environment

```bash
# Rebuild the image from scratch (e.g. after Dockerfile changes)
docker compose -f .devcontainer/docker-compose.yml up -d --build --force-recreate

# Wipe node_modules volume and reinstall
docker volume rm pair-up-events_node_modules
docker compose -f .devcontainer/docker-compose.yml up -d
# Then inside container: npm install
```
