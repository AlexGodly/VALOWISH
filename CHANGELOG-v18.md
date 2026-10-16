# VALOWISH v18 — Buying Simulator & Priority VP

**Release classification:** Experimental  
**Developer:** Alex Godly  
**Baseline:** v17 Experimental

## New — Buying Simulator

- Dedicated Buying Simulator page in the desktop sidebar and mobile More navigation.
- Create, name, duplicate, delete and switch between independent buying plans.
- Add cosmetics directly from Wishlist and Priority with **+ Buying Simulator** actions.
- Add cosmetics through a searchable popup using the catalog, Wishlist, or Priority as a source, with cosmetic category selection.
- Maintain an ordered purchase queue: drag on desktop, move up/down, enter a new rank, or remove an item.
- See running cumulative VP and a plan-wide cost estimate.
- Per-plan simulated VP balance independent of the account's actual tracked VP.
- VP needed, simulated balance, shortfall, VP remaining, owned/skipped item counts, and unknown-price warnings.
- Manually set custom estimated VP prices on any cosmetic, including bundles, cards, buddies, sprays, and Flexes.
- Multiple plans and ordering are persisted in local backups and the existing Supabase JSON record.
- Prevent duplicate items within one plan while allowing different plans to contain the same cosmetic.
- No simulated action automatically buys a cosmetic, marks it owned, deducts VP, or changes Priority order.

## Improved — Universal Priority

- VP statistics in Global Priority, each cosmetic category, and per-weapon Priority (Ghost, Vandal, Warden, etc.).
- Exclude already-owned cosmetics from additional VP needed.
- Show the tracked VP balance and additional estimated VP shortfall for the current scope.
- Display per-item prices in Priority and Wishlist, including a clear **VP PRICE UNKNOWN** state when no estimate is available.
- Direct navigation from Priority to Buying Simulator.

## Safety, compatibility and data

- Uses a new **`valowish_v18`** local data key and automatically reads the older v15/v14/etc. keys on first use.
- Existing v17 priorities, category/weapon-specific rankings, Wishlist, Locker, custom prices, Loadout Studio, history, and profiles remain in place.
- Existing Supabase `valowish_data` JSON record; **no database schema migration**.
- Unpriced cosmetic categories are not guessed to be free or given invented prices. Bundle overlaps are not automatically deducted.
- Existing GitHub Pages build-free static deployment, approved branding, title, and responsive layouts preserved.

## Verification

- `node --check assets/app.js` — passed.
- CSS stylesheet parsing and referenced-file validation — passed.
- `node tests/v18_smoke.cjs` — passed: legacy migration, Priority VP, unknown prices, owned exclusions, plan costs, independent ordering, multi-plan creation, budget scenarios, persistence and non-destructive behavior.
- Full interactive browser testing was unavailable in the current environment, and live Supabase/network integrations remain unverified. This is why the release is classified **Experimental**.