# VALOWISH v15 — REBORN / Preview 1

**Developer:** Alex Godly  
**Basis:** VALOWISH v14 Modular  
**Status:** First working implementation milestone (source), **not a production-ready v15 release**.

## Implemented

1. React 18 + TypeScript 5 + Vite 6 + Tailwind v3 + custom tactical VALOWISH design system.
2. New approved W-crest favicon and matching branding.
3. Completely new desktop sidebar and mobile-first bottom navigation, plus secondary More sheet.
4. Command Center dashboard showing wishlist, locker, priority, manually tracked VP and recent activity.
5. Discover with multi-category API integration: weapon skins, bundles, player cards, titles, buddies, sprays, flexes, agents, maps, game modes, seasons and events (subject to availability from the public API).
6. Dynamic weapon identification: no hardcoded gun names (supports Outlaw, Bandit and Warden once present in API data).
7. Skin details modal with artwork, chromas, level information and available video links.
8. Official content tier lookup for skin editions, when supplied by the API; user-editable estimated rarity/skin VP prices.
9. Wishlist, Locker, Priority ranking, favorites, purchase actions, VP tracker, activity history, undo and redo.
10. Additional feature pages: personal Loadout Studio, Purchase Planner with VP goals, and Insights.
11. Search, status filtering (including all legacy show/hide owned/wishlisted variants), weapon filter, sorting, list/grid views, pagination and cache fallback.
12. v14 and earlier local data migration to independent v15 storage key; same existing Supabase URL, publishable key and `valowish_data` schema, account authentication, and backup import/export.
13. Responsive desktop/tablet/mobile layouts, mobile bottom sheets, fullscreen cosmetic detail view on smaller screens.
14. GitHub Actions Vite Pages workflow with `/VALOWISH/` base path.

## QA performed here

- 21 TypeScript/TSX source files parsed and all internal imports resolved.
- TypeScript offline type checks using local ambient stubs (not a substitute for the real dependency types).
- Strict type check of standalone data/migration/catalog modules.
- Node smoke tests passed: migration, undo/redo, purchase, dynamic new guns, ID collision protection, VP price estimates.
- CSS syntax parsed with zero top-level errors.
- **Not verified:** npm dependency installation, Vite production bundle, actual browser interactions, Supabase authenticated session, API reachability, or real GitHub Pages deployment. Offline npm registry access was unavailable.

## Remaining before declaring v15 complete

- Install locked dependencies and run actual Vite/Vitest/browser tests.
- Browser-verify all screens at desktop, tablet and mobile breakpoints.
- Test live skin/media endpoints and images, including flex/event fallback cases.
- Audit legacy feature parity; improve batch actions, legacy sorting, cloud safety and history accuracy.
- Extend agents, maps, events, bundles and season detail pages with their category-specific metadata.
- Add richer collection tools (notes, tags, paid prices UI, grouping, comparison) and improve loadout asset loading.
- Add migration backup and cloud security regression tests on a staging account.
- Roll out only after acceptance and authorized GitHub deployment.

## Production safety

No writes to the user's GitHub repository, Supabase project, or production deployment have been performed by this build. Existing v14 production should stay active until validated.
