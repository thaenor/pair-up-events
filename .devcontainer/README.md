# Dev Container

This project can run fully inside a Dev Container so your host machine stays clean.
Project dependencies, Firebase tooling, emulator assets, Java, and Playwright browser
binaries live inside the container or Docker volumes instead of polluting your main machine.

## What this setup uses

- Base image: `mcr.microsoft.com/devcontainers/javascript-node:24-bookworm`
- Java 21 Dev Container feature for Firebase emulators
- Docker volumes for:
  - `node_modules`
  - npm cache
  - Firebase cache
  - Playwright cache
- Port forwarding for:
  - `5173` Vite dev server
  - `8080` Vite preview
  - `4000` Firebase Emulator UI
  - `4400` Firebase Emulator Hub
  - `8081` Firestore emulator
  - `9099` Auth emulator
  - `9150` Firestore WebChannel
  - `9199` Storage emulator

## Prerequisites

- Docker Desktop or Docker Engine
- VS Code with the **Dev Containers** extension, or the `devcontainer` CLI

## Open in the container

### VS Code

1. Open the repository in VS Code.
2. Run **Dev Containers: Reopen in Container**.
3. Wait for the container build and post-create setup to finish.

### CLI

```bash
devcontainer build --workspace-folder .
devcontainer up --workspace-folder .
```

## Run the app

Open a shell inside the container and start the services you need.

### Start the Vite app

```bash
npm run dev
```

The app is available on forwarded port `5173`.

### Start Firebase emulators

```bash
npm run emulator:start
```

The Emulator UI is available on forwarded port `4000`.

## Run tests

```bash
npm test
npm run test:e2e
npm run lint
npm run typecheck
```

## Run coding agents inside the container

If you use local CLIs for agents, run them from inside the container so they see
the same isolated toolchain and emulator environment.

```bash
devcontainer exec --workspace-folder . claude
devcontainer exec --workspace-folder . qwen
```

## Notes

- `VITE_USE_EMULATOR=true` is set automatically in the container config.
- `node_modules` stays in a Docker volume, not on your host filesystem.
- Firebase emulator downloads and Playwright browser downloads are also kept
  in Docker-managed storage.
- If you change the dev container config, rebuild the container.

## Rebuild

```bash
devcontainer build --workspace-folder . --no-cache
devcontainer up --workspace-folder .
```
