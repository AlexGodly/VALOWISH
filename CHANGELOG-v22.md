# VALOWISH v22 — Bundle Ownership Progress & Skin Edition Filters

**Release channel:** Experimental (production VALOWISH Supabase writes cannot be inspected through the currently linked account).

## Bundle ownership progress

- Every bundle card in Discover, Favorites, Wishlist, Locker and Priority displays a compact owned-items progress indicator.
- The Bundle Details page prominently displays the count of individually owned, **user-curated** contents and a corresponding percentage bar.
- Progress updates immediately when users mark an included weapon skin, player card, gun buddy, spray or other curated item as owned/unowned or add/remove a curated item.
- A bundle with no curated contents displays `0 / 0` and an invitation to add contents; it does not claim 100% ownership.
- Marking the bundle itself as owned does **not** count its contained cosmetics as individually owned.
- Progress is derived from the existing `bundleContents` and `owned` collections, with no duplicate server-side counters to become stale.

## Weapon skin edition filtering

- Discover → Weapon Skins gains an **All Editions** menu that filters the catalog by its `contentTierUuid`-derived edition labels.
- Wishlist, Locker, Favorites (Cosmetics) and Priority also have an edition dropdown. It works alongside weapon, status, price, search, and sorting controls, including global/scoped Priority.
- Supports Select, Deluxe, Premium, Exclusive and Ultra editions when present, as well as future edition names and unknown/unclassified skins.
- Collection edition filters are saved using the existing auto-synced preferences, and persist after page refresh or another device syncs the data.
- Filter reset and switching from Cosmetics to Game Intel clear the edition condition to avoid an apparently empty Intel view.

## Compatibility and safety

- Local state storage key advances to `valowish_v22` with a migration fallback to v21 and previous versions.
- No Supabase schema changes: existing account JSON, ownership, bundle curation, backups, and automatic cloud synchronization remain in use.
- The bundle API does not provide complete verified item membership; progress is accurately labeled as **tracked/user-curated** rather than presenting guessed contents as authoritative.

## Verification

- JavaScript syntax validation passed.
- Desktop (1366px) and narrow mobile (360px) Chromium smoke tests passed: edition filtering, bundle progress 0/0 → 0/2 → 1/2 → 2/2, bundle ownership independence, saved filter preferences after reload, and no horizontal overflow.
- Simulated Supabase cloud regression suite passed (15 scenarios, including concurrent bundle curation and sync preferences).
- Actual Supabase production sync is not directly verified; this is an Experimental release.
