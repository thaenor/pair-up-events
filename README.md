# Pair Up Events

Pair Up Events is a marketing site and authentication experience for a social platform that helps pairs of friends meet other pairs for shared activities. The landing page highlights how the service works, showcases key benefits, and captures early-access sign ups, while a dedicated auth flow supports email and social logins backed by Firebase. This README is designed to orient human contributors and AI coding assistants so they can confidently extend the experience while adhering to the project's conventions.

## Table of Contents

1. [Product Overview](#product-overview)
2. [Core Features](#core-features)
3. [Tech Stack](#tech-stack)
4. [Local Development](#local-development)
5. [Project Structure](#project-structure)
6. [Testing & Quality Gates](#testing--quality-gates)
7. [Deployment Notes](#deployment-notes)
8. [Supporting Documentation](#supporting-documentation)
9. [Agentic Coding Guidelines](#agentic-coding-guidelines)

## Product Overview

- **Primary goal:** help two-person friend groups discover and schedule activities with another pair to create a four-person hangout.
- **Experience highlights:**
  - Story-driven landing page that walks visitors through the pairing journey.
  - Benefits section emphasising the safety and social ease of meeting as a group of four.
  - Early-access capture embedded via Brevo (Sendinblue) forms.
  - Dedicated authentication route offering social and email/password sign in backed by Firebase.

## Core Features

- **Hero & storytelling** blocks with high-impact imagery, persuasive copy, and clear calls to action.
- **How it Works** section outlining the three-step pairing flow for visitors.
- **Benefits grid** reinforcing community safety, curated matches, and flexible scheduling.
- **Testimonials & FAQs** to build trust (see `src/pages/home.tsx`).
- **Early-access signup** via Brevo embed (`src/lib/config.ts`).
- **Authentication** at `/login` using Google, Apple, Facebook, and email/password options managed by a shared auth context.
- **Responsive design system** based on atomic components built with Tailwind CSS, shadcn/ui styling primitives, and lucide-react icons.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with shadcn-inspired components
- [Firebase Authentication](https://firebase.google.com/docs/auth) for OAuth and email sign-in
- [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for unit and component tests
- [ESLint](https://eslint.org/) for static analysis

## Local Development

### Prerequisites

- Node.js 20.x (match the version specified in `package.json`)
- npm (bundled with Node.js)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and provide your credentials:
   ```bash
   cp .env.example .env.local
   ```
3. Update `.env.local` with the Firebase and Sentry values for your project. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for step-by-step guidance, including OAuth redirect configuration.

### Running the app

Start the local development server:

```bash
npm run dev
```

Vite prints a local URL (default `http://localhost:5173`). The marketing landing page is available at `/`, and the authentication experience is served at `/login`.

## Project Structure

```
src/
├── components/        # Atomic design-inspired UI building blocks
├── contexts/          # Shared React contexts (e.g., AuthProvider)
├── hooks/             # Reusable custom hooks, including Firebase auth helpers
├── lib/               # Firebase config/initialisation and shared utilities
├── pages/             # Route-level components (landing page, auth, 404)
└── tests/             # Vitest test suites
```

Design references are available inside [`Designs/`](./Designs/).

## Testing & Quality Gates

Always ensure that linting, tests, and builds succeed before opening a pull request:

```bash
npm run ci
```

This single command runs all quality checks (linting, testing, and building) that CI pipelines expect to pass. Use this command every time you make changes to validate everything is working as expected.

### E2E Testing

E2E tests are run locally using Husky pre-commit hooks to ensure all functionality works before commits are made. The GitHub Actions CI pipeline focuses on unit tests, linting, and building to keep deployment fast and reliable.

**Local E2E Testing:**

- E2E tests run automatically before each commit via Husky
- Manual E2E testing: `npm run test:e2e`
- E2E tests with UI: `npm run test:e2e:ui`
- View E2E reports: `npm run test:e2e:report`

**CI Pipeline:**

- Unit tests, linting, and building run on every push/PR
- GitHub Pages deployment happens automatically on main branch pushes
- E2E tests are excluded from CI to maintain fast deployment cycles

## Deployment Notes

- The application is automatically deployed to GitHub Pages on pushes to the main branch.
- Ensure Firebase Authentication is configured for the providers exposed in the UI.
- Provide the required Firebase and Sentry environment variables in your deployment platform.
- If you customise the early access form, update `src/lib/config.ts` with the new Brevo embed URL.

With the prerequisites in place, you can iterate on the Pair Up Events experience or extend it with additional routes and Firebase-backed functionality.

## Supporting Documentation

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) – Firebase project and OAuth configuration steps.
- [Gemini.md](./Gemini.md) – Full operational protocol for AI coding assistants (reproduced below for convenience).

## Agentic Coding Guidelines

This repo is an exercise and a personal test to see how far it is possible to get using agentic coding. We've used Loveable, Gemini, Cursor, Codex and Copilot. Is it Sop? Is it actually decent code? Can it be halfway decent if we prompt it right? Would the users care if it's slop? - those are some answers we will try to figure out.
