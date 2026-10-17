# VALOWISH v21 — Bundles, Favorites & Collection Organization

**Status:** Experimental — browser interaction tests and simulated two-device cloud tests passed; live VALOWISH Supabase verification remains pending.

## Bundle Details — full-page dossier
- Clicking a bundle in Discover, Favorites, Wishlist, or Locker now opens its own responsive Bundle Details page.
- Large promo artwork, descriptions, available bundle metadata, tracked state, and price override appear together.
- Bundle-level Favorite, Wishlist, Owned, and Buying Simulator buttons remain independent of tracking individual contents.
- Dedicated contents area with searchable catalog picker for weapon skins, buddies, sprays, player cards, titles, and Flexes. Contents are stored per bundle and synchronized in the existing cloud JSON record.
- Suggested possible cosmetics are clearly marked **unverified** and never silently added to bundle contents.
- A source limitation: the current public Valorant-API `/v1/bundles` response does not provide an authoritative list of line items or official VP bundle pricing. For that reason v21 does not invent bundle memberships or prices. Contents are explicitly user-curated until a reliable source is integrated.
- Bundle price overrides and known item-value sums are displayed without assuming unknown prices are zero.

## New Favorites page
- Dedicated Favorites navigation page, split into **Cosmetics** and **Game Intel** with tabs for their respective catalog categories.
- Quick filtering by weapon, item state, VP range, and cosmetic category. Favorites saved from Discover or a Bundle page appear automatically.
- Works for agents, maps, seasons, events and game modes as well as cosmetic types.

## Wishlist / Locker / Priority — advanced filters and sorting
- Dedicated category tabs for Wishlist, Locker, and Priority; sorting by custom/recent order, oldest, alphabetical, VP value, and (Priority only) priority tier.
- Weapon, item state, Favorite, Wishlist, Owned, Buying Simulator, and VP range filtering.
- All collection filter preferences, including search, are kept per page through account settings, local backups, and cloud synchronization.
- Priority's independent Global/Category/Weapon order stays intact even when the visible results are sorted. Added a **Filtered VP Needed** calculation beside its overall scoped VP total.
- Locker reports known estimated collection value and the count of items without VP pricing.

## Automatic cloud saving and data preservation
- Continues v20 background Supabase sync, snapshot recovery, and conflict-free reconciliation.
- Retains previous data in `valowish_v20` and earlier storage keys for migration.
- Normalizes the new `bundleContents` map, while keeping previous collections and purchase plans intact.
- Three-way cloud reconciliation merges independent edits to the same bundle contents list without discarding additions.
- No destructive SQL changes or database migration.

## Verification
- Chrome-based simulated catalog UI tests: passed on 1440px desktop and 375px mobile, covering bundle actions and picker, Favorites tabs, category selection, per-page filters, and saved-data recovery after simulated reload.
- Simulated Supabase tests: passed, including cross-device restore, automatic save, concurrent edit merge, cloud recovery, v19 migration, bundle contents merge, and Favorites sorting/category settings synchronization.
- JavaScript syntax and CSS parser validation passed.
- Not verified: production Supabase account, live catalog availability and image delivery on actual remote devices.

The app is an independent fan project by Alex Godly, not affiliated with Riot Games.