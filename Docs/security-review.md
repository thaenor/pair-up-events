# Security Review - Pair Up Events

## Overview
This review captures the immediate hardening completed during this task and additional recommendations for operating the application securely in production. The scope covered the static entry point, client-side authentication flows, and third-party integrations such as Google Tag Manager (GTM) and Firebase Authentication.

## Hardening Completed
- **Content Security Policy (CSP):** Added a restrictive CSP that limits all resource types to trusted origins, blocks plugin usage, enforces same-origin framing rules, and upgrades insecure requests. This mitigates the risk of XSS, clickjacking, and mixed-content issues.
- **Externalized GTM bootstrap script:** Moved the GTM initialization into a standalone asset that can be governed by the CSP without falling back to `unsafe-inline` permissions.
- **Strict referrer policy:** Ensures that only the origin is shared with third-party destinations, reducing leakage of sensitive route information.

## Observations & Recommendations
1. **Serve with HTTP security headers:** When deploying, configure the hosting layer (e.g., CDN or reverse proxy) to send `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, and `Permissions-Policy`. These cannot be reliably enforced from static HTML meta tags.
2. **CSP reporting:** Consider adding a `report-to`/`report-uri` directive once you have monitoring infrastructure. This will surface CSP violations in production without relaxing the policy.
3. **Dependency hygiene:** Keep `firebase`, `react`, and build tooling up to date and enable automated vulnerability scanning (e.g., GitHub Dependabot or `npm audit`).
4. **Secrets management:** Firebase credentials are consumed via `import.meta.env`. Ensure `.env` files are excluded from version control (already covered by default) and use environment-specific API keys with restricted scopes in Firebase.
5. **Authentication UX:** Registration and password reset flows expose error messages sourced from Firebase. They are routed through a centralized handler, but continue to prefer generic user-facing text to avoid leaking implementation details.
6. **Third-party embeds:** GTM can inject additional scripts. Periodically audit enabled tags and restrict access to the GTM workspace to prevent malicious injections that could bypass front-end controls.

## Next Steps
- Add end-to-end tests that exercise authenticated routes to catch regressions when tightening CSP or adding new integrations.
- Document operational runbooks for revoking Firebase credentials and rotating GTM container IDs in case of compromise.
- Evaluate server-side rendering or edge middleware if future features require secrets or privileged data fetching; client-side Firebase alone exposes the project configuration to end users.
