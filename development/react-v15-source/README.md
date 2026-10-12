# VALOWISH — REBORN

**v15 preview / first implementation milestone** · by Alex Godly

A rebuilt, Valorant-inspired cosmetics application. This repository contains the **new React / TypeScript / Vite / Tailwind** codebase. It is an in-progress v15 preview, **not a production replacement for v14**.

## Included in this milestone

- New desktop sidebar, mobile bottom navigation, tactical dark/red design system and approved W crest branding.
- Command Center dashboard; Discover (12 API category integrations); Wishlist, Locker, Priority; Skin Detail panel including chromas and levels when available; Loadout Studio, Purchase Planner, Insights, History, Account and Settings.
- Legacy v14-to-v15 local JSON migration without changing original keys, same Supabase `valowish_data` table, editable skin price estimates, cloud auth and backups.
- API caching, search/filter/sort, pagination, favorites, ownership, priority, manual purchase tracking and basic undo/redo.
- Automated unit tests and GitHub Pages workflow, including `/VALOWISH/` base path.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

Visit Vite's displayed local URL. For deployment, publish `dist/` through `.github/workflows/pages.yml` (GitHub Pages source must be Actions, and Pages workflow must replace any old competing deployment configuration).

## Limitations — read before replacing the live website

- This is **a preview**, not a claim of complete v14 feature parity, browser QA or live cloud integration testing.
- The API may not provide all bundles/flexes/events or level previews. Missing categories display a retry/error state instead of fabricated content.
- The cosmetic rarity mapping and collection price estimates are incomplete; VP values are **not official live shop prices**.
- Personal loadouts are app-only presets; cannot equip Riot weapons.
- Older cloud accounts keep the existing table; testing is required before production migrations/writes. Ensure a database backup exists.
- Some cosmetic collections and historical data require additional validation.
- The GitHub workflow uses `npm install` because this offline-authored project has no `package-lock.json` yet. Generate and commit a lockfile with `npm install` on a network-connected machine, then switch to `npm ci` for deterministic builds.

## Deployment safety

Do not replace the existing v14 production branch yet. Test the preview in a separate branch or GitHub Pages staging deployment and validate accounts plus every existing feature before promotion.

This is an independent fan project and is not affiliated with Riot Games.
