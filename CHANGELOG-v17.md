# VALOWISH v17 — Discover, Priority & Loadout Studio Overhaul

**Classification:** Experimental  
**Developer:** Alex Godly  
**Baseline:** v16 Stable  
**Data:** Existing v15 local storage key and Supabase `valowish_data` format preserved.

## 1. Discover catalog artwork fixed
- Built category-specific artwork layouts for weapon skins, bundles, player cards, titles, buddies, sprays, Flexes, agents, maps, game modes, seasons and events.
- Artwork is contained in a bounded area and cannot cover card text or action buttons.
- Player cards get a portrait artwork area; weapon skins use a landscape view; buddies, sprays, Flexes and modes use contained previews.
- Titles, events and seasons have text-first fallback designs when artwork is not supplied by the catalog.
- Improved name wrapping, card footer positioning and readability on narrow phones.
- Removed the irrelevant Weapon filter from non-weapon catalog categories.
- Catalog imagery uses category-appropriate API fields where available.

## 2. Global, Category and Weapon Priority 2.0
- Global Priority shows all prioritized cosmetics in one master order.
- Category tabs create separate lists for weapon skins, bundles, player cards, player titles, buddies, sprays and Flexes.
- By Weapon includes Ghost, Vandal, Phantom, Bandit, Outlaw, Warden and other dynamic weapon names from the skin catalog.
- Each scoped view remembers an independent manual order without overwriting Global Priority.
- Native drag-and-drop for desktop; up/down buttons and direct rank entry for other devices.
- Search, sorting, tiers and existing Wishlist integration are preserved.
- Added additive `priorityViews` storage without a database schema migration.

## 3. Loadout Studio 2.0 — Interactive Builder
- Completely replaces the owned-skins-only dropdown editor with a visual weapon-slot armory inspired by the user-provided reference.
- Default weapon slots cover Sidearms, SMGs, Shotguns, Rifles, Sniper Rifles, Machine Guns and Melee, including Bandit, Outlaw and Warden.
- Dynamically recognizes future weapons when the catalog returns them.
- Clicking a weapon opens a responsive modal with **Skins** and **Gun Buddies** tabs, searchable choices, sort, Owned/Wishlist filters and pagination.
- Choose any catalog skin for dream loadouts, not only owned skins; chosen gun buddies are saved separately per weapon.
- Adds Player Card, Player Title, four Spray slots and Flex selectors.
- Create, rename, duplicate, delete and switch between multiple independent loadouts.
- Estimated total VP, unowned estimated VP and assigned skin counts are displayed; estimates are not live Riot store prices.
- Loadouts are personal plans and do not modify Riot game inventory.

## 4. Branding and responsive UI
- Removes visible release version labels from the application UI; version remains in GitHub Releases.
- Keeps the approved VALOWISH logo and wordmark on screens, with a new brand asset query for refresh.
- Retains the browser title `VALOWISH by Alex Godly` and the loading text `Loading VALOWISH`.
- Adds a full-screen mobile item picker and compact touch-friendly armory slot grids.
- Prioritizes clear controls and scroll containment on desktop and mobile.

## 5. Compatibility and verification
- No Supabase SQL migration and no destructive database changes.
- Existing Wishlist, Locker, History, VP, pricing, Priority and cloud-data representation remain preserved.
- Local browser smoke tests passed on simulated desktop and 375 px mobile devices: global/scoped priority independence, rank entry, Warden slot, skin and buddy selection, loadout duplication, catalog card rendering and filtering. No JavaScript exceptions in those simulated tests.
- Source JavaScript passes `node --check`; CSS passes syntax parsing.
- **Experimental label:** Live Supabase account synchronization, production API behavior across all content categories and full cross-browser parity still require validation. The browser tests used mocked catalog responses.