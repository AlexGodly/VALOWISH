# VALOWISH v24 — Data Safety, Weapon-Type Priorities, Multi-Filters, Video Player & Completion

**Release status:** Experimental (verified with automated simulated multi-tab/cloud tests and real Chromium at desktop and mobile widths; production Supabase not directly inspected).

## Your data no longer gets erased

Three separate causes of lost data were found and fixed:

- **Browser storage filling up.** Earlier versions cached the entire VALORANT catalog (every skin with all variants and levels, plus cards, buddies and sprays) in the same ~5 MB browser storage that holds your collection. Once it filled up, every save of your data failed silently and changes disappeared on reload. The catalog now lives in IndexedDB, old catalog caches are removed on startup to free space, and the undo history saved to storage is trimmed.
- **An old tab overwriting newer data.** A VALOWISH tab left open (including a background tab on your phone) could sync its outdated copy and remove everything added in another tab or on another device. Tabs now stay in sync with each other, and a tab always merges the latest saved data before it saves or syncs.
- **Saved priority orders lost before the catalog loaded.** Removing an item while the skin catalog was still loading could wipe your per-weapon priority orders. Those orders are now kept.

Extra protection:

- **Large-removal safety check.** If a sync would remove a large part of your cloud data at once, it stops, keeps recovery copies of both versions, and asks you in Settings → Account & Cloud.
- **No more silent failures.** If this browser still can't save, a warning banner appears with a one-tap backup export.
- **Persistent storage.** VALOWISH asks the browser to keep its data instead of clearing it automatically.
- **Sign-in reminder.** If you aren't signed in, the Command Center reminds you that your collection exists only in this browser (Safari clears site data after 7 days without a visit).

## Priority lists per weapon type

- New **BY WEAPON TYPE** view in Priority, with independent ranked lists for Sidearms, SMGs, Shotguns, Rifles, Sniper Rifles, Machine Guns and Melee.
- Each list has its own drag/move order and VP totals, and starts from your Global order. Global, category and per-weapon lists are unaffected.

## Multi-select edition and weapon-type filters

- Editions (Select, Deluxe, Premium, Exclusive, Ultra, Unclassified) and weapon types are now tappable chips. Pick any combination; with nothing selected, everything is shown.
- Available in Discover → Weapon Skins, Wishlist, Locker, Favorites, Priority, the buying plan popup and Insights.
- Your v22 single edition choice converts automatically. Selections sync across devices.

## Buying plan popup

- Full filters and sorting: weapon, weapon type, edition, status (hide owned, wishlisted, favorites, not in this plan…), VP range. Sort by name, VP, edition, priority rank or weapon. New Favorites source.
- **Multi-select:** checkboxes on every item, *Select page*, *Select all matching* and *Clear*, plus a bar showing the selection count and VP total and a single **+ ADD TO PLAN** button.
- **The list stays where it is.** Adding or selecting updates only that row. The popup remembers your filters and position.
- A more compact phone layout gives the list about twice as much room.

## In-app video player

- Variant and level videos now play in a popup inside VALOWISH instead of opening a new tab.
- **Variant videos are included** (Riot provides them; earlier versions ignored them). Variants with a video show ▶ in the details popup.
- Variants and Levels tabs, previous/next, Esc or ✕ to close, and arrow keys to switch videos. If a video can't load, an "open in new tab" fallback appears.

## Collection completion and milestones

- Insights shows how much of VALORANT you own for each category (skins, bundles, cards, titles, buddies, sprays, Flexes) as owned/total with progress bars.
- Weapon skins by type, expandable per weapon (e.g. Sheriff 7 / 41). Tap a weapon to browse the skins you're missing.
- Milestones at 10 · 25 · 50 · 75 · 100%, showing how many more items you need for the next one.
- Edition filter (e.g. Exclusive + Ultra only) and a toggle to count the free Standard skins.
- The Command Center shows your overall skin completion and closest milestone.

## Fixes

- New weapons Riot adds go into their own **Other** group instead of Melee.
- Pagination in filtered Wishlist/Locker/Favorites/Priority views now counts the filtered results.
- A sync issue now stays visible ("⚠ SYNC ISSUE") after further edits instead of switching back to "Sync pending".
- Bundle and Loadout pickers also keep their scroll position.
- Added the missing `favicon-32.png` and `apple-touch-icon.png`, and bumped asset cache tags so returning visitors get the new version.

## Compatibility

- No Supabase schema changes and no SQL migration. Local storage key stays `valowish_v22`, so your existing data is read as-is.

## Tests

- `node tests/v24_logic.cjs`: 14 scenarios, including stale tabs with and without cloud sync, full storage, large-removal protection, weapon-type lists, filters, bulk add and completion. The data-loss scenarios fail on v23 and pass on v24.
- `python3 tests/v24_browser.py`: 60 checks in real Chromium at 1366px and 375px (filters, priorities, popup scroll stability, multi-add, video playback and fallback, completion, two-tab safety, no horizontal overflow, no JavaScript errors).
