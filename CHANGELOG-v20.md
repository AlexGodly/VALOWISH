# VALOWISH v20 — Automatic Cloud Sync

**Release status:** Experimental (production VALOWISH Supabase account was not accessible for live verification)

## No more routine “Review Cloud” prompts

- Cloud saving now works automatically for signed-in accounts, without asking the user to review normal data differences each time the page loads or devices exchange changes.
- The top-bar cloud state now reports **Cloud Saved**, **Sync Pending**, **Restoring**, or **Offline** instead of showing **Review Cloud** for ordinary differences.
- The Settings → Account & Cloud panel explains that saving happens in the background; **Sync Now** is optional, not required.
- Pending edits continue to use local persistence, periodic synchronization, reconnect retry, and per-account cloud restore from v19.

## Conflict-free multi-device reconciliation

- Three-way merges automatically combine unrelated edits to the Wishlist, Locker, Favorites, buying plans, loadouts, history, priorities, and settings where possible.
- Ordered priority lists and Buying Simulator steps keep the newer ordering while preserving independent additions from another device and respecting intentional removals.
- When both devices change a *single scalar value* differently (for example, VP balance or profile name), the latest known edit takes precedence. Both complete pre-merge snapshots are retained in recovery storage so older values are not irretrievably discarded.
- If an older v19 browser has data but no established cloud baseline, v20 automatically reconciles its collections with the cloud instead of requiring the user to select an entire copy. Existing cloud settings remain authoritative when the local edit time is unknown.
- A local-only reset still cannot wipe cloud data; edits made after the reset reconcile safely on the next sync.
- Cloud writes continue to use the saved `updated_at` value as an optimistic-concurrency condition. If another device wins a race, the app reloads and reconciles rather than blindly overwriting that copy.

## Safety and compatibility

- Automatic reconciliation makes recoverable local backup snapshots of **both** copies whenever the histories are ambiguous.
- If the network is offline, the device keeps changes locally and retries when it reconnects.
- Existing `public.valowish_data` schema, RLS and Supabase configuration are unchanged; **no SQL migration** is required.
- Current local cache is `valowish_v20`. The app migrates `valowish_v19` and earlier local data and retains the v19 account-specific sync baselines and recovery snapshots.
- Extremely unexpected failures or corrupt records still require intervention; automatic reconciliation cannot guarantee a conflict-free result for every possible simultaneous edit, and a two-device test does not replace live Supabase testing.

## Tests

- `node --check assets/app.js`: passed.
- Simulated two-device Chromium tests passed for first-login restores, autosave, cross-device fetching, independent updates, simultaneous scalar changes, automatic recovery from v19 local data, concurrent Buying Simulator updates, local reset protection and clean runtime without browser exceptions.
- Unverified: actual live VALOWISH Supabase account, long-running connectivity interruptions, data mutated outside VALOWISH, and all mobile devices.