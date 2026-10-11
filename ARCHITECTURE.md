# VALOWISH — Architecture

VALOWISH v14 is a GitHub Pages-ready **build-free modular web project**.

## Source layout

- `index.html` — document structure and ordered asset references.
- `styles/` — foundation and UI, responsive layouts, mobile navigation, performance adjustments.
- `assets/` — application icon.
- `src/core/` — configuration, storage, shared state, catalog/price helpers and navigation.
- `src/ui/` — filters, cards, price editor and pagination.
- `src/features/` — collection, purchase and ranking mutations.
- `src/pages/` — Browse, Wishlist, Priority, Locker, History and Settings renderers.
- `src/services/` — Valorant catalog fetching/caching and Supabase cloud integration.
- `src/events/` — UI and account event binding.
- `src/bootstrap.js` — non-blocking startup.
- `supabase_setup.sql`, `supabase/functions/delete-account/` — existing backend setup reference.

## GitHub Pages

This app publishes directly from `main` / root `index.html`. No npm install, compiler, build job or payment is required. Internal assets use relative `./` paths so GitHub Pages subpaths work correctly. Preserve `index.html` at the repository root and commit the accompanying folders on each update.

## Developer note: shared browser global scope

For v13-to-v14 functional compatibility the source files use **ordered classic browser scripts**, sharing global declarations and existing inline event handlers. They are not isolated ES Modules yet. Load order in `index.html` matters. The next phases may introduce ES modules, TypeScript, React, or another UI toolkit with a build pipeline when desired. Browsers do not execute TypeScript directly.

## Storage and cloud

New storage key `valowish_v14` migrates prior keys (v13 to v3). Account sync uses the same existing Supabase project and `valowish_data` schema. No SQL migration is needed for v14. Do not publish service-role keys or other server-only secrets.

## Testing

`python tests/verify_project.py` validates paths, bundled assets, script syntax via Node.js, core HTML structure, and CSS parse. The project has no npm dependencies. External live services still require network access and account credentials for end-to-end testing.
