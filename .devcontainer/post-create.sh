#!/bin/bash
set -e

# Fix workspace ownership
sudo chown -R node:node /workspaces/pair-up-events

# Enable pnpm via corepack (needs sudo for symlink to /usr/local/bin)
sudo corepack enable pnpm

# Install deps
npm install

npm install -g @anthropic-ai/claude-code