# syntax=docker/dockerfile:1

# ── Base image ─────────────────────────────────────────────────────────────────
# Node 25 as required in package.json "engines"
# node:25 ships with npm; we add Java (needed by Firebase emulators) and
# the system libraries required by Playwright Chromium.
FROM node:25-bookworm-slim

# ── System dependencies ────────────────────────────────────────────────────────
# openjdk-17-jre-headless  → Firebase emulators (Java-based)
# Playwright Chromium deps → resolved by `playwright install --with-deps`
# git                      → husky git hooks + VSCode source-control
# curl                     → health-checks / firebase CLI install
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jre-headless \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ── Firebase CLI ───────────────────────────────────────────────────────────────
# Installed globally so `firebase emulators:start` is available in PATH
RUN npm install -g firebase-tools

# ── Create workspace directory ─────────────────────────────────────────────────
# The devcontainer.json mounts the repo here at runtime
WORKDIR /workspace

# ── Non-root user ──────────────────────────────────────────────────────────────
# The official node image ships a built-in "node" user (uid 1000).
# Running as non-root is a security best practice.
# We give the "node" user ownership of the workspace.
RUN chown -R node:node /workspace
USER node

# ── Default shell ──────────────────────────────────────────────────────────────
SHELL ["/bin/bash", "-c"]
