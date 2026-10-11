# VALOWISH

**VALOWISH by Alex Godly** is a mobile-friendly VALORANT skin Wishlist, Priority List and Locker manager with collection tracking, pricing, history and optional Supabase cloud sync.

## Project structure

The v14 codebase is split into `src/core/`, `src/ui/`, `src/pages/`, `src/features/`, `src/events/`, `src/services/`, `styles/`, and `assets/`. `index.html` assembles these files. See [ARCHITECTURE.md](ARCHITECTURE.md) for dependencies and development guidelines.

## Features

Browse skins from the Valorant API, search/filter by weapon/rarity/collection status, use paginated cards, organize a Wishlist, rank skins in a Priority List, track owned skins in Locker, manage VP/custom pricing, review history and use import/export backups. Optional Supabase authentication and cloud sync retain the existing single-account data format.

## GitHub Pages

There is **no npm installation or build step**. GitHub Pages can serve `index.html` directly from the repository root, with the files in their current folders. All internal URLs are relative to the site root. Retain the existing GitHub Pages publishing settings.

## Development and checks

Source files can be edited independently. Run `python tests/verify_project.py` and `node tests/smoke_runtime.cjs` to check syntax, assets, basic UI flows and pagination. Node.js and Python are needed only for tests, not for the deployed application.

Cloud authentication requires network access and the existing Supabase deployment. Live cloud functionality should be tested in the deployed site before treating it as fully verified.

## Disclaimer

VALOWISH is an independent fan-made project, not affiliated with Riot Games. VALORANT and related properties belong to their owners.
