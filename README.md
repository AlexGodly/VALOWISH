# VALOWISH v15 — REBORN / Ready-to-Open Recovery Build

**This build fixes the white screen in Preview 1.** The first preview shipped Vite/React TypeScript source, but its `index.html` was not a compiled webpage. Opening it directly in a browser or deploying it without a working Vite build could show a blank screen.

## Run
Open `index.html` from this directory, or publish `index.html` and `assets/` together on GitHub Pages. **No npm, Node.js, Vite installation, build command, or paid provider is required for this ready-to-open site.** Keep `assets/` next to `index.html`. The initial application shell displays even without a network connection. Online access is required to fetch current cosmetic data and use Supabase cloud services.

## GitHub Pages
The ZIP contents are already in deployable root layout:
```
index.html
assets/app.js
assets/main.css
assets/favicon.png
assets/favicon-64.png
.nojekyll
```
On `AlexGodly/VALOWISH`, GitHub Pages should publish from `main` / root, using the existing deployment configuration. Internal URLs are relative (`./assets/...`), compatible with `https://alexgodly.github.io/VALOWISH/`.

The zip itself **has not been pushed** to GitHub and production deployment has **not** been completed. If the repository was switched to a custom Vite-only GitHub Actions workflow, that workflow must be replaced or Pages switched to branch/root before deploying this static build.

## Implemented in the ready site
- VALOWISH REBORN shell, responsive desktop sidebar, bottom mobile navigation and More sheet.
- Home/Command Center, Discover, Wishlist, Locker, Priority, Loadouts, Planner, Insights, History, Settings.
- Dynamic cosmetic categories via Valorant-API (skins, bundles, cards, titles, buddies, sprays, Flexes, agents, maps, game modes, seasons, events). Actual API coverage may vary.
- Search, weapon/status/sort filters, bounded pagination, collection actions, item details, chromas/levels where the API supplies them, tracked VP, estimates, configurable prices and notes.
- Favorites, ownership, Wishlist, priority ordering, saved loadouts, savings goals, local import/export, undo/redo for supported collection actions.
- Auto local migration from v14 and supported older keys; Supabase client loaded optionally without blocking startup; uses existing Supabase project and `valowish_data` JSON column.

## Compatibility and limitations
This is a **self-contained JavaScript production recovery build**, not a verified production bundle of the original React/TypeScript preview. The original React/Vite source has been preserved separately in the full source package for continued migration. This is intentionally a reliable static runtime while that migration is completed.

The available cosmetic API does not reliably expose actual individual-account shop prices, ownership, or VP balance. All such data is manually managed/estimated. Supabase auth and live cloud sync require internet access and valid existing backend configuration. **Live end-to-end cloud testing was not possible in this environment.** User records are stored locally; use Export Backup before replacing the running site.

## Validation
- `node --check assets/app.js`
- `node tests/verify_ready.cjs`
- Headless browser tests: Command Center, Discover, paginated 45-item catalog, Wishlist/Locker persistence, Details, Purchase Planner, mobile More navigation, with mock catalog and no remote cloud library.
- Browser tests do not constitute verified live Supabase, live API, or cross-browser production parity.

## Branding and automated releases

The brand assets are located under `assets/` (`valowish-mark.svg`, `valowish-wordmark.svg`, and `favicon.svg` plus PNG icons). The title shown in the browser is **VALOWISH by Alex Godly**.

Every new update should increment the version in `release.json`, choose an appropriate status (`Stable`, `Experimental`, `Unstable`, etc.), and write a matching `CHANGELOG-vN.md`. On push to `main`, `.github/workflows/publish-release.yml` creates a GitHub Release tagged `N` titled `vN <status>` with the changelog as release notes. Existing tags/releases are not overwritten. GitHub Pages deployment is managed by the repository's existing Pages configuration.

## v18 — Buying Simulator

Open **Buying Simulator** in Operations (desktop sidebar) or the mobile More menu. Create one or more buying plans, add cosmetics from Wishlist/Priority or search the cosmetic catalog, then reorder purchases and see estimated total/remaining VP. Plans do not deduct your actual VP or change item ownership. Prices for non-weapon cosmetics must be entered manually when unknown.

The Priority page now calculates estimated VP needed for each Global/Category/Weapon scope. v18 data is persisted in `valowish_v18`, with automatic local migration from earlier supported versions; Supabase JSON synchronization uses the existing table. Run `node tests/v18_smoke.cjs` for the offline data tests.

## Cloud sync reliability (v19)

After logging in, VALOWISH automatically reads the account's `valowish_data` record. Edits are stored locally immediately and then synchronized to Supabase. Multi-device writes use the existing `updated_at` timestamp as a concurrency check to avoid overwriting another device's changes. If incompatible data exists on the device and cloud, the app pauses synchronization and offers manual recovery options in Settings. Backups can be exported and previous-version local data can be restored when available.

For cross-device access, use the **same VALOWISH account** on every device. A "Cloud Saved" status and timestamp means the latest successful database confirmation was received; "Offline", "Pending", and "Conflict" statuses mean data is not yet confirmed in cloud. No database migration is required for the existing `valowish_data` table.