# v14 → v15 migration guardrails

The new React app reads `valowish_v15`, falling back to `valowish_v14`, `valowish_v13`, and earlier supported keys. It writes only to its own `valowish_v15` local storage key, preserving older records for rollback. It uses the existing public `valowish_data` table and a normal publishable client key, never a service-role key.

Legacy skin IDs remain unprefixed UUIDs. Other cosmetic categories use `category:uuid` identifiers so two catalog types cannot collide. Existing `wishlist`, `owned`, `priority`, `prices`, `tiers`, `name`, `vp`, `rarityPrices`, `history`, `undoStack`, and `redoStack` fields are preserved. Optional new fields such as `favorites`, `notes`, `goals`, and `loadouts` are additive.

Before public rollout, back up production data and test logins, cloud import/export, old users, new users, logout/login, duplicate tabs and offline reconnection in staging. Cloud loading gives priority to existing cloud data over the device's previous data, matching the previous architecture. No SQL schema changes are required for Preview 1.
