#!/usr/bin/env bash
set -euo pipefail

corepack enable || true
npm install
npm install -g firebase-tools

# Pre-download Firebase emulator JARs so the first `emulator:start` is instant
firebase setup:emulators:firestore || true
firebase setup:emulators:ui || true

# Install Playwright Chromium + system deps inside the container
npx playwright install --with-deps chromium
