# Google Analytics (GA4) - Setup and testing

This project initializes Google Analytics (GA4) at runtime using the `initGA` helper in `src/lib/analytics.ts`.

Important points
- Analytics is loaded only when the environment variable `VITE_GA_MEASUREMENT_ID` is set and (after the recent changes) only after the user accepts cookies via the `CookieConsent` banner.
- The project no longer relies on a hardcoded snippet in `index.html` to avoid duplicates and to respect consent.

How to configure in Netlify
1. Open your site in Netlify and go to Site settings → Build & deploy → Environment.
2. Add a new variable:
   - Key: `VITE_GA_MEASUREMENT_ID`
   - Value: `G-2D03R2HBMN` (or your actual measurement ID)
3. Trigger a new deploy (Deploys → Trigger deploy → Clear cache and deploy site) to ensure the env var is applied to the build.

How it works after deploy
- When a user visits the site, the `CookieConsent` component shows a consent banner (unless the user already granted/denied consent).
- If the user accepts and the env var is set, `CookieConsent` calls `initGA(id)` and the GA script (`gtag.js`) is injected dynamically and `gtag('config', ...)` is executed.
- Page views and events are tracked using `trackPage` and `trackEvent` helpers in `src/lib/analytics.ts`.

Testing locally
- Create a file named `.env` or `.env.local` at the repo root with the content:
```
VITE_GA_MEASUREMENT_ID=G-2D03R2HBMN
```
- Run the dev server:
```bash
npm run dev
```
- Open the site in your browser, accept cookies on the banner and verify that `window.gtag` is defined in the console.

Quick checks (deployed site)
- After a deploy with the env var set, inspect the page source or use curl to confirm the GA script is not present in the static HTML (it is injected by the client after consent).
- To validate Google detects the tag: open the site in a browser, accept the cookie banner, and then use the Google console "Install manually" tester or the GA realtime view.

Privacy and compliance
- If you serve users in the EEA, make sure the consent workflow satisfies your legal requirements. Consider integrating a CMP if you need a formal consent log or granular preferences.

If you want, I can:
- Add a small footer link to allow revoking consent.
- Prepare a PR with these changes (already applied) and a short changelog entry.
