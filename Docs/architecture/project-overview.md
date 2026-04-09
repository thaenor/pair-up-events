# Project Overview

## Product Vision

Pair Up Events is a social event platform that helps two-person friend groups discover and schedule activities with another pair to create four-person hangouts. The marketing site highlights how the service works, showcases key benefits, and captures early-access sign-ups, while a dedicated auth flow supports email and social logins backed by Firebase.

### Core Differentiator: 2-Meets-2 Model

The platform connects **two pairs** (duos) instead of individuals, creating more comfortable and balanced social encounters. Supported pair types include friends, couples, family pairs (parent-child, siblings), and roommates.

### Key User Objectives

- Enable users to create, browse, and join events with minimal friction
- Connect two pairs based on shared interests, location, and availability
- Encourage activity-based, curiosity-driven interactions (not dating or networking)
- Provide a mobile-first, responsive platform emphasizing usability and clarity

## Tech Stack

| Layer                  | Technology            | Version               |
| ---------------------- | --------------------- | --------------------- |
| **Frontend Framework** | React                 | 18.3.1                |
| **Language**           | TypeScript            | 5.5.3                 |
| **Build Tool**         | Vite                  | 7.1.7                 |
| **Styling**            | Tailwind CSS          | 3.4.11                |
| **UI Components**      | shadcn/ui             | (via Tailwind)        |
| **Icons**              | lucide-react          | Latest                |
| **Backend/Auth**       | Firebase Auth         | (Native SDK)          |
| **Database**           | Firestore             | (Native SDK)          |
| **Storage**            | Firebase Storage      | (Native SDK)          |
| **App Verification**   | Firebase App Check    | (Native SDK)          |
| **Error Tracking**     | Sentry                | Latest                |
| **Unit Testing**       | Vitest                | 3.2.4                 |
| **Component Testing**  | React Testing Library | 16.3.0                |
| **E2E Testing**        | Playwright            | 1.56.1                |
| **Linting**            | ESLint                | (FlatConfig)          |
| **Formatting**         | Prettier              | Latest                |
| **Package Manager**    | npm                   | (Node.js 20.x)        |
| **Deployment**         | GitHub Pages          | (Auto on main branch) |

## Repository Structure

```
src/
├── components/              # Atomic design UI building blocks
│   ├── atoms/               # Basic UI elements (Button, Modal, Tabs, Logo)
│   ├── molecules/           # Composed UI blocks (Auth forms, Event cards)
│   ├── organisms/           # Large components (Landing, Navigation, Chat)
│   ├── templates/           # Page layouts
│   └── __tests__/           # Component tests
├── pages/                   # Route-level components (home, login, events, settings)
├── hooks/                   # Custom React hooks (useAuth, useAIChat, custom logic)
├── contexts/                # React Context providers (UserContext)
├── entities/                # Data models with Zod validation
├── lib/
│   ├── firebase/            # Firebase config and helpers
│   ├── ai/                  # AI integration (prompt-builder, response-parser)
│   ├── utils.ts             # Shared utility functions
│   ├── storage-service.ts   # LocalStorage wrapper
│   └── config.ts            # App config (Brevo, etc.)
├── types/                   # TypeScript type definitions
└── main.tsx                 # Application entry point

tests/
├── unit/                    # Unit test guidelines
├── e2e/                     # E2E test guidelines
└── setup.tsx                # Global test setup

Docs/
├── architecture/            # Project knowledge (factual)
├── CHANGELOG.md             # Project history and decisions
├── Backlog.md               # Prioritized work items
├── data-model.md            # Firestore schema
└── component-tree-map.md    # Component hierarchy
```

## Core Features

- **Marketing Landing Page** – Story-driven experience with benefits grid, testimonials, FAQs
- **Early-Access Signup** – Brevo form integration
- **Authentication** – Google, Apple, Facebook, and email/password via Firebase Auth
- **Event Management** – Create, browse, and join events (2 pairs per event)
- **In-App Chat** – Lightweight messaging between paired users
- **Responsive Design** – Mobile-first, works on all devices
- **Error Tracking** – Sentry integration for production monitoring

## Build & Deployment

### Local Development

```bash
npm install                 # Install dependencies
npm run dev                 # Start Vite dev server (port 5173)
npm run build              # Production build
```

### Quality Gates

```bash
npm run ci                 # Runs: format → lint → typecheck → test → build
npm run test              # Vitest unit tests
npm run test:e2e          # Playwright E2E tests
```

### CI/CD Pipeline

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Runs on every push to main branch
- Automatically deploys to GitHub Pages on success
- Node.js 20.x LTS pinned for consistency

## Environment Setup

Create `.env.local` with Firebase and Sentry credentials:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_SENTRY_DSN=...
```

See `FIREBASE_SETUP.md` for step-by-step configuration.

## Key Architectural Decisions

1. **Atomic Design Pattern** – Ensures scalable, reusable component hierarchy
2. **Firebase Backend** – Firestore for realtime data, Auth for identity management
3. **Vite + React + TypeScript** – Modern, fast build with type safety
4. **E2E Tests on Android Pixel 5** – Mobile-first testing approach
5. **Direct Imports Only** – Tree-shaking optimization, no barrel exports
6. **Firestore Cost Optimization** – Batched writes, cached reads, minimal listeners
