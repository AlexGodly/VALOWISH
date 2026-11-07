# VALOWISH Architecture

VALOWISH is a static site served by GitHub Pages. There is no build step.

## Runtime files
- `index.html` — page shell; loads `assets/main.css` and `assets/app.js` (bump the `?v=` tag each release).
- `assets/app.js` — the whole app: catalog loading, collections, priorities, buying plans, loadouts, store check, esports, insights, settings and cloud sync.
- `assets/main.css` — all styles (desktop and mobile).
- `manifest.webmanifest` + `sw.js` — installable app and offline support. App files are network-first (never stuck on an old version); cosmetic images are cache-first; Supabase is never cached.
- `assets/` — icons, logo and images.

## Data
- User data: localStorage key `valowish_v22` (+ per-account copies), merged across open tabs via `valowish_rev_v24`. Synced to Supabase table `valowish_data` (see `supabase_setup.sql`) when signed in.
- Game catalog cache: IndexedDB database `valowish_catalog_v24` (kept out of localStorage so it can't crowd out user data).
- "New since last visit" baseline: localStorage key `valowish_seen_v29` (this device only).
- Catalog source: valorant-api.com (unofficial, public). No Riot account access.

## Other folders
- `supabase/functions/delete-account` — Edge Function used by Settings → delete account.
- `legacy/` — archived earlier versions, still served at `/legacy/<version>/`.
- `development/` — unused React v15 experiment, kept for reference only.

## Tests
- `node tests/logic.cjs` — app logic in a simulated browser (data safety, sync merging, filters, priorities, plans, completion, esports, store check).
- `python3 tests/browser.py` — real Chromium at desktop (1366px) and phone (375px) widths, including offline start-up. Needs Playwright and ffmpeg.

## Releases
Push to `main` with an updated `release.json` and `CHANGELOG-v<version>.md`; the `Publish VALOWISH Release` workflow creates the GitHub release and Pages deploys the site.
