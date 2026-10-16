# VALOWISH v19 — Cloud Sync Reliability & Data Recovery

**Classification:** Experimental (real VALOWISH Supabase production account not yet available for live verification)  
**Developer:** Alex Godly  
**Baseline:** v18

## Critical data-loss fixes

- **Automatic cloud restoration on refresh:** Restoring an existing Supabase session now also retrieves and restores that user's saved VALOWISH data. Previously, the app restored the login but failed to pull the account data.
- **Reliable autosaving:** Every collection, Wishlist, Locker, Priority, Favorites, purchase plan, loadout, goal, account preference, price, history, and other state change saves locally immediately and queues a cloud sync when logged in.
- **Cross-device synchronization:** When another device changes the cloud data, returning to VALOWISH or selecting Verify & Sync Now refreshes the local copy; active signed-in clients also check roughly every 90 seconds.
- **Prevents stale overwrites:** Cloud writes check the database `updated_at` value before updating. If another device has saved since the last read, VALOWISH re-fetches instead of overwriting that device's data.
- **Smart reconciliation:** Non-overlapping changes can merge safely. Conflicting changes remain untouched until the user selects whether to retain the cloud or device version.
- **Account isolation:** Local caches and cloud sync snapshots are associated with the corresponding Supabase user, preventing another account's data from being uploaded accidentally when users switch accounts.
- **Safe local reset:** Resetting local data explicitly leaves the cloud copy intact. On sign-in, an untouched local reset is restored from cloud rather than silently deleting the cloud backup.
- **Network resilience:** Failed writes remain saved locally and are retried with backoff, with an additional check on reconnect and when the tab becomes active.

## New Cloud & Recovery panel

- Visible cloud state: **Cloud Saved**, **Saving Changes**, **Restoring Cloud**, **Offline**, or **Sync Needs Your Decision**.
- Last verified successful cloud save timestamp.
- **Verify & Sync Now** action.
- When local and cloud histories conflict: **Restore Cloud to Device**, **Keep Device & Update Cloud**, and **Download Both Backups**.
- Automatic on-device recovery snapshots before replacing or merging data.
- Restore data from earlier local VALOWISH version records if still present on this browser.

## Compatibility / data safety

- Preserves the `public.valowish_data` row schema, `data jsonb`, `user_id` RLS isolation, and `updated_at` timestamp. **No Supabase SQL migration is needed.**
- Supports reading previous v18–v2 local backups; writes active local data to `valowish_v19`.
- Existing cosmetic catalog, Buying Simulator, loadouts, VP tracking, and all v18 features remain.
- The recovery feature cannot restore data that is absent from both the browser's saved copies and Supabase's current records.
- Users must sign into **the same VALOWISH Supabase account** on every device for automatic synchronization.

## Validation

- JavaScript syntax and CSS parsing passed.
- Simulated two-browser Supabase tests passed for restoring login data, autosave, second-device restore, cross-device updates, concurrent independent edits, conflict protection, user-selected cloud recovery, and safe local-only reset. No runtime page errors in these tests.
- **Not yet verified:** real connected VALOWISH Supabase project/account, real-world network edge cases, and all mobile devices. Classification remains Experimental until live cloud QA confirms reliability.