# VALOWISH v25 — Pick Weapons by Name

**Release status:** Experimental (automated logic tests and real-Chromium desktop/mobile tests passed; production Supabase not directly inspected).

## Weapon filters use weapon names
- The weapon dropdown and the weapon-type chips are replaced by **weapon-name chips** (Classic, Shorty, Frenzy, Ghost, Bandit, Sheriff, Vandal…), grouped by class.
- **Multi-select:** pick any combination, e.g. Ghost + Sheriff, and combine with editions, e.g. Ghost + Sheriff × Exclusive + Ultra.
- Tap a class label (SIDEARMS, RIFLES…) to select or clear every weapon in that class at once.
- Available in Discover → Weapon Skins, Wishlist, Locker, Favorites, Priority and the buying plan popup.
- Saved filters convert automatically: a previously chosen weapon or weapon type becomes the matching weapon names.

## Priority by weapon
- **BY WEAPON** now shows every weapon as a chip, grouped by class, with how many prioritized skins each has, instead of a dropdown. Tap one to open its own ranked list.
- **BY WEAPON TYPE** lists from v24 are still available.

## Fixes
- Long chip rows no longer push the page sideways on phones; each row scrolls on its own.
- Completion categories with no catalog data say "Not available" instead of loading forever.
