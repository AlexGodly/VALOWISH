# VALOWISH v14 — Modular Project Foundation

**Baseline:** user-uploaded v13 single HTML. **Hosting:** GitHub Pages without build tooling.

- Refactored v13 into `index.html`, 4 stylesheets, 20 feature-organized JavaScript sources, and a standalone icon.
- Retained Browse, Wishlist, Priority, Locker, History, Settings, VP, pricing, imports/exports, pagination, undo/redo and Supabase account/cloud features.
- Isolated cloud library startup so failure of the external Supabase CDN does not stop the main UI.
- Fixed Wishlist fixed-size pagination instead of rendering the entire Wishlist.
- Moved Collection Status into the main Browse filter toolbar with matching design.
- Improved filter clearing, view-mode toggle, local data reset and API error fallback escaping.
- Retained previous version migration and 18 mobile / 36 larger-screen page sizes.
- No database migration or paid services required.

This is a source refactor, not a React rewrite. Native browser source can be migrated to React/TypeScript later if useful.
