# Code Audit & Optimization Recommendations

## Methodology
- Reviewed the React/Vite project structure with a focus on `src/` components, routing, and configuration files.
- Ran `npx depcheck` to look for unused runtime/dev dependencies.
- Cross-referenced Tailwind theme tokens against component usage and reviewed compositional patterns for maintainability.

## Dead or Unused Implementation
- The `/auth` route is commented out, leaving `AuthPage` and its supporting UI (e.g., `AuthLayout`, `SocialAuthButton`) unused in the shipped bundle.【F:src/App.tsx†L1-L14】【F:src/pages/auth.tsx†L1-L43】【F:src/components/templates/auth-layout.tsx†L1-L24】【F:src/components/molecules/social-auth-button.tsx†L1-L28】 Consider either wiring the route back in or deleting the dormant code to reduce bundle size and maintenance surface.
- `LoadingState` is a higher-level wrapper around `LoadingSpinner` but it is not exported from the component barrel file and is never rendered in production screens, while `PageWrapper` inlines a bespoke spinner UI.【F:src/components/index.ts†L1-L14】【F:src/components/molecules/LoadingState.tsx†L1-L63】【F:src/components/templates/PageWrapper.tsx†L1-L30】 Consolidating on a single loading primitive would simplify the API.

## Dependency Observations
- `jsdom` is listed under `dependencies`, yet it is only required for the Vitest environment and could be moved to `devDependencies` to avoid bloating production installs.【F:package.json†L15-L47】【F:vitest.config.ts†L7-L28】
- `@tailwindcss/typography` is declared as a dev dependency but never imported or registered in `tailwind.config.ts`; remove it or enable the plugin if rich prose styling is desired.【F:package.json†L25-L47】【F:tailwind.config.ts†L1-L138】
- `depcheck` flagged `autoprefixer` and `postcss` as unused, but they are wired through `postcss.config.js`, so those should stay unless PostCSS is removed from the toolchain.【32f119†L1-L4】【F:postcss.config.js†L1-L6】

## Styling & Theming Issues
- Several components reference `text-pairup-darkblue`, but the Tailwind theme exports `darkBlue` (camelCase). This casing mismatch prevents Tailwind from generating the intended utilities, so the text color silently falls back to defaults.【F:tailwind.config.ts†L67-L74】【F:src/components/organisms/BenefitsSection.tsx†L1-L58】【F:src/components/organisms/HowItWorksSection.tsx†L1-L49】 Normalizing the class names to `text-pairup-darkBlue` (and similar variants) will align with the configured tokens.
- `HeroSection` duplicates the "scroll to early access" behavior with raw DOM querying instead of reusing the callback already provided by the layout, leading to inconsistent behavior if the section id changes.【F:src/components/organisms/HeroSection.tsx†L32-L50】【F:src/components/templates/LandingPageLayout.tsx†L12-L28】 Passing the handler through props would keep the scroll logic centralized.

## Architecture & UX Opportunities
- `PageWrapper` implements its own spinner markup even though `LoadingSpinner` already exists, and `NotFound` uses `window.location.href` instead of the router's navigation helpers.【F:src/components/templates/PageWrapper.tsx†L1-L30】【F:src/components/atoms/LoadingSpinner.tsx†L1-L48】【F:src/pages/NotFound.tsx†L1-L44】 Reusing shared atoms and `useNavigate` will reduce duplication and preserve client-side routing semantics.
- `Navigation` maintains props for authentication states but only renders a static CTA today, and it includes an extraneous React fragment wrapper around the button. Tightening the API to the currently supported behavior will make the component easier to test and extend later.【F:src/components/organisms/Navigation.tsx†L5-L56】
- The Tailwind `content` array still scans several legacy globs (`./components`, `./pages`) even though all sources now live under `src/`. Keeping only the necessary paths speeds up rebuilds on larger projects.【F:tailwind.config.ts†L5-L13】

## Completed Actions
- Moved `jsdom` into `devDependencies` and removed the unused `@tailwindcss/typography` plugin to keep the toolchain lean.
- Trimmed the Tailwind `content` globs to `index.html` and `src/**/*` so rebuilds skip unused legacy directories.
- Normalized `pairup` color utility casing across hero, benefits, and "how it works" sections to align with the Tailwind theme tokens.
- Centralized the "Get Started" scroll behavior via shared callbacks passed from the page layout, replacing ad-hoc DOM queries.
- Updated `PageWrapper` and 404 handling to reuse shared loading/navigation primitives instead of bespoke DOM manipulations.

## Next Steps
1. Decide whether to restore the authentication flow; if not, remove the dormant files and tests tied to it.
