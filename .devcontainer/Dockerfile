# =============================================================================
# pair-up-events — DevContainer Dockerfile
# Base: Anthropic claude-code Dockerfile, adapted for this project's stack
# Stack: Node 20 · React 18 · TypeScript · Vite · Tailwind · Firebase · Playwright
# =============================================================================

FROM node:20

ARG TZ
ENV TZ="$TZ"

ARG CLAUDE_CODE_VERSION=latest

# ── System packages ───────────────────────────────────────────────────────────
# Anthropic base tools + openjdk (Firebase emulators) + Playwright browser deps
RUN apt-get update && apt-get install -y --no-install-recommends \
  # — Anthropic base —
  less \
  git \
  procps \
  sudo \
  fzf \
  zsh \
  man-db \
  unzip \
  gnupg2 \
  gh \
  iptables \
  ipset \
  iproute2 \
  dnsutils \
  aggregate \
  jq \
  nano \
  vim \
  # — Firebase emulators require a JVM —
  openjdk-17-jre-headless \
  ca-certificates \
  curl \
  wget \
  # — Playwright / Chromium system dependencies —
  chromium \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  xdg-utils \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# ── npm-global dir ────────────────────────────────────────────────────────────
RUN mkdir -p /usr/local/share/npm-global && \
  chown -R node:node /usr/local/share

ARG USERNAME=node

# ── Persist shell history ─────────────────────────────────────────────────────
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# ── Environment markers ───────────────────────────────────────────────────────
ENV DEVCONTAINER=true

# Tell Playwright to use system Chromium (avoids a ~300 MB download per rebuild)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

# Java home for Firebase emulators
# M1/M2 Mac (arm64) → java-17-openjdk-arm64
# Intel Mac / CI (amd64) → java-17-openjdk-amd64
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
ENV PATH=$PATH:$JAVA_HOME/bin

# ── Workspace + Claude auth directories ──────────────────────────────────────
RUN mkdir -p /workspace /home/node/.claude && \
  chown -R node:node /workspace /home/node/.claude

WORKDIR /workspace

# ── git-delta (nicer diffs in terminal) ──────────────────────────────────────
ARG GIT_DELTA_VERSION=0.18.2
RUN ARCH=$(dpkg --print-architecture) && \
  wget "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

# ── Non-root user ─────────────────────────────────────────────────────────────
USER node

ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin
ENV SHELL=/bin/zsh
ENV EDITOR=nano
ENV VISUAL=nano

# ── Zsh + Powerlevel10k (unchanged from Anthropic base) ──────────────────────
ARG ZSH_IN_DOCKER_VERSION=1.2.0
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
  -p git \
  -p fzf \
  -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
  -a "source /usr/share/doc/fzf/examples/completion.zsh" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -x

# ── Global CLI tools ──────────────────────────────────────────────────────────
# • @anthropic-ai/claude-code  — the AI agent
# • firebase-tools             — `firebase emulators:start` used in npm scripts
RUN npm install -g \
  @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} \
  firebase-tools

# ── Firewall script (from Anthropic base, unchanged) ─────────────────────────
COPY init-firewall.sh /usr/local/bin/
USER root
RUN chmod +x /usr/local/bin/init-firewall.sh && \
  echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall && \
  chmod 0440 /etc/sudoers.d/node-firewall
USER node
