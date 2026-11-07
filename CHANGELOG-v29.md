# VALOWISH v29 — Install as an App, Daily Store Check, Esports & New Cosmetics

**Release status:** Experimental (automated logic tests and real-Chromium desktop/mobile tests passed, including offline start-up; production Supabase not directly inspected).

## Install VALOWISH as an app
- Add VALOWISH to your phone's home screen or your computer like an app: its own icon, full screen, no browser bar.
- **Works offline:** the app opens and shows your saved collection with no connection, and images you've already seen are cached.
- Updates still arrive straight away when you're online; you're never stuck on an old version.
- **Settings → Install VALOWISH** offers an install button where the browser supports it, and instructions for iPhone (Share → Add to Home Screen).

## Daily Store Check (Operations)
- Log the 4 skins from your in-game store by typing their names. Nothing connects to your Riot account.
- Each skin shows whether it's on your wishlist, its priority rank (overall and for that weapon), which buying plans contain it, and whether you own it. Skins you want are highlighted as **WANTED**.
- A summary shows how many wanted skins are in today's store, their total VP, and whether your tracked VP covers them.
- One-tap actions on each skin: wishlist, add to a buying plan, mark as bought, change, remove.
- History of previous stores, plus how often each skin has appeared in your checks.
- Follows Riot's daily reset at 00:00 UTC, with a countdown. The Command Center shows today's result.

## Esports
- A new **Esports** page groups Champions (by year), VCT LOCK//IN and other VCT items, and team capsules (e.g. "VCT x 100T" → 100 Thieves) across skins, bundles, cards, buddies, sprays and titles.
- Owned/total progress for all esports items and for each event or team, with an **ESPORTS** badge on cards and an "Esports only" option in Discover.
- Riot's data doesn't label esports items, so they're recognised by name. A few may be missing or misgrouped. Lookalikes such as *Sentinels of Light* are excluded.

## New since your last visit
- VALOWISH remembers the catalog on each device. Bundles, skins, cards, buddies, sprays, titles and Flexes that Riot adds later get a **NEW** badge.
- The Command Center lists new items by category and shows new bundles. **Mark all as seen** clears them, and they also clear by themselves after 21 days.
- Discover has a "New since last visit" filter.

## Other changes
- The phone bottom bar keeps Command Center, Discover, Wishlist and Locker. Esports and Daily Store Check are under **More**.
- Removed the unused v14 `src/` and `styles/` folders and the old test scripts that no longer matched the app. The tests are now `tests/logic.cjs` (19 scenarios) and `tests/browser.py` (92 desktop/phone checks).
- Rewrote `ARCHITECTURE.md` to describe the current app.
