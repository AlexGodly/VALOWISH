# VALOWISH

> A VALORANT skin wishlist, collection, priority, VP, history, and cloud-sync manager.

**VALOWISH v3.0** is the final major release of VALOWISH, built by **Alex Godly**.

VALOWISH is designed for VALORANT players who want more than a basic wishlist. It gives you one place to browse weapon skins, save skins you want, decide which ones matter most, track skins you already own, plan VP spending, keep a history of activity, and synchronize your VALOWISH data through an account.

---

## What is VALOWISH?

VALOWISH is a personal companion app for organizing your VALORANT skin collection and future purchases.

The core workflow is:

**Browse -> Wishlist -> Priority -> Purchase -> Locker -> History**

You choose the skins you want. VALOWISH helps you organize them.

It does **not** purchase skins from Riot Games, access your VALORANT inventory, modify your Riot account, or manipulate your real VP balance. The VP and ownership systems inside VALOWISH are personal tracking/planning tools.

---

## Why VALOWISH?

A normal wishlist can tell you which skins you like, but once that list becomes large it does not answer questions such as:

- Which skin do I want the most?
- Which skins are Must Buy versus lower priority?
- How much VP would my current Priority List require?
- Which skins have I already bought?
- What is the estimated value of my Locker?
- What did I wishlist or buy recently?
- How can I keep the same tracker when I move to another device?

VALOWISH was built around those problems.

Instead of treating every wanted skin equally, it separates your collection into dedicated systems for discovery, wishlisting, priority planning, ownership, pricing, spending, and history.

---

## v3.0 Highlights

VALOWISH v3.0 brings the complete project together and introduces account-based cloud storage.

### VALOWISH Cloud

v3.0 adds Supabase-powered authentication and cloud persistence.

Users can:

- Sign up with a name, email, and password
- Log in and log out
- Keep an authenticated session
- Synchronize VALOWISH data to the cloud
- Manually trigger a cloud sync
- Change their display name
- Change their account email
- Change their password
- Delete their account

Local browser storage remains part of the app, while authenticated users gain a private cloud record tied to their account.

### Private user data

Cloud data is stored in the `valowish_data` table and tied to the authenticated Supabase user ID.

The included database setup enables **Row Level Security (RLS)** so authenticated users can read and modify their own VALOWISH record rather than another user's data.

### Secure account deletion

Account deletion requires privileged Supabase functionality and therefore must not expose the service-role key in the browser.

The project architecture supports performing account deletion through a Supabase Edge Function. The service-role key belongs only in the server-side function environment.

---

## Features

### Browse

Browse the VALORANT skin library using live skin data.

The Browse interface supports:

- Skin artwork
- Skin names
- Weapon information
- Rarity/tier information
- Estimated or configured VP pricing
- Wishlist status
- Ownership status
- Grid/list presentation
- Search
- Advanced filters

### Advanced Filters

VALOWISH includes custom-styled filters for:

- Skin status
- Weapon
- Rarity

Weapon and rarity filters support multi-selection.

Rarity categories used by VALOWISH include:

- Select
- Deluxe
- Premium
- Exclusive
- Ultra

Status filtering includes:

- All Skins
- Unowned
- Owned
- Wishlisted

### Wishlist

Save skins you are interested in without immediately treating all of them as equal priorities.

The Wishlist answers:

> **What skins do I want?**

Wishlisted skins can later be added to the Priority List when you want to decide what should come first.

### Priority List

The Priority List answers:

> **Which skins do I want first?**

Priority features include:

- Automatic numerical ranking
- Drag-and-drop ordering
- Move Up / Move Down controls
- Direct rank jumping with a rank number + GO
- Must Buy / High / Medium / Low priority levels
- VP requirement calculations
- Purchase actions
- Price editing
- Adding wishlisted skins into the priority plan

For large lists, direct rank jumping lets you move an item from a distant position directly to the rank you want without dragging through the entire list.

### VP Tracker

VALOWISH includes a personal VP balance tracker.

You can use it to plan purchases and estimate whether your tracked VP balance is enough for a skin.

Purchasing through VALOWISH can deduct the configured skin price from the **tracked VALOWISH balance** and move the skin into the Locker.

This does not interact with your real Riot Games VP balance.

### Rarity Pricing

Default rarity prices are configurable from Settings.

Default values included with VALOWISH are:

| Rarity | Default VP |
| --- | ---: |
| Select | 875 |
| Deluxe | 1,275 |
| Premium | 1,775 |
| Exclusive | 2,175 |
| Ultra | 2,475 |

These are app defaults/estimates and can be changed.

### Per-Skin Custom Pricing

Individual skins can override their rarity default.

When a custom price is assigned to a skin, the custom value takes priority throughout VALOWISH. You can later remove the override and return the skin to its rarity default.

Custom prices are used by relevant calculations such as Priority totals, purchase tracking, and Locker estimates.

### Locker

The Locker represents skins you have marked as owned.

It includes:

- Owned skin tracking
- Search and filters
- Owned skin count
- Estimated VP value/spending
- Price editing

Skins can be marked as owned manually or moved into the Locker through VALOWISH's purchase workflow.

### History

History provides a chronological record of supported activity inside VALOWISH.

It includes views for:

- Latest activity
- Last Wishlisted
- Last Bought

History entries retain useful skin/activity information and can provide access to related actions such as price management.

### Undo & Redo

VALOWISH includes Undo and Redo support for supported state changes, helping recover from accidental actions without manually rebuilding the previous state.

### Import & Export

VALOWISH supports JSON backup and restoration.

This gives the project multiple persistence options:

1. **Local storage** - immediate browser persistence.
2. **JSON export/import** - a user-controlled portable backup.
3. **VALOWISH Cloud** - authenticated remote persistence.

### Responsive Design

VALOWISH is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The interface adapts cards, filters, settings, history, priority controls, and navigation according to screen size.

Phones and tablets use an app-style bottom navigation for:

**Browse - Wishlist - Priority - Locker - History**

---

## Technology

VALOWISH is primarily a web application built with:

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`
- SortableJS for drag-and-drop behavior
- VALORANT API skin data
- Supabase JavaScript client
- Supabase Auth
- Supabase PostgreSQL / JSONB
- Supabase Row Level Security

The project intentionally keeps the frontend lightweight instead of requiring a large frontend framework.

---

## Project Structure

A full Supabase-enabled deployment can use the following structure:

```text
VALOWISH/
|
|-- index.html
|-- supabase_setup.sql
|-- README.md
|
`-- supabase/
    `-- functions/
        `-- delete-account/
            `-- index.ts
```

### `index.html`

The VALOWISH frontend and main application logic.

### `supabase_setup.sql`

Creates the per-user VALOWISH cloud-data table and configures Row Level Security policies.

### `supabase/functions/delete-account/index.ts`

Server-side Supabase Edge Function used for secure account deletion.

Do not place the Supabase service-role key inside `index.html`.

---

## Installation

### 1. Download or clone the project

Place the VALOWISH project files in your web project directory.

### 2. Create a Supabase project

Create a project in Supabase and obtain the URL and browser-safe publishable/anon key for the project.

### 3. Configure the database

Open the Supabase SQL Editor and run:

```text
supabase_setup.sql
```

The supplied setup creates the `valowish_data` table and enables the required RLS policies.

### 4. Configure VALOWISH

In `index.html`, locate:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY';
```

Replace them with your Supabase project values.

Use only the browser-safe publishable/anon key.

**Never put `SUPABASE_SERVICE_ROLE_KEY` in the HTML or any client-side JavaScript.**

### 5. Configure authentication URLs

In your Supabase authentication settings, configure the Site URL and any redirect URLs required by the domain where VALOWISH will be hosted.

### 6. Deploy the delete-account function

Deploy the project's `delete-account` Edge Function if you want permanent account deletion from inside VALOWISH.

The server-side function requires the appropriate Supabase environment secrets, including the service-role credential required for privileged account deletion.

### 7. Serve VALOWISH over HTTP(S)

For the most reliable authentication and browser behavior, run VALOWISH through an HTTP(S) server rather than opening the HTML directly using `file://`.

For local development, any simple local web server is sufficient.

---

## Database

The cloud model intentionally stays simple: each authenticated account owns one VALOWISH state record.

Conceptually:

```text
auth.users
    |
    `-- user id
          |
          `-- valowish_data.user_id
                    |
                    `-- data (JSONB)
```

The database row contains the user's serialized VALOWISH application data.

This approach keeps the current app simple while allowing the full state to move between authenticated sessions/devices.

---

## Row Level Security

The included SQL enables RLS and policies for authenticated users.

The intended rule is simple:

> A user can access their own VALOWISH data, not another user's data.

RLS is an important part of the cloud architecture. Do not disable it just to make database requests easier.

---

## Local & Cloud Behavior

VALOWISH uses local storage for immediate browser persistence.

When a cloud account is active, changes can also be synchronized to the authenticated user's Supabase record.

The general model is:

```text
User action
   |
   v
VALOWISH state
   |
   +----> localStorage
   |
   `----> Supabase cloud data (when authenticated)
```

JSON export remains available as an independent backup method.

---

## Data Portability

VALOWISH is designed so users are not limited to cloud storage alone.

You can:

- Export your data
- Keep the JSON backup yourself
- Import it later
- Keep local browser data
- Use cloud synchronization when logged in

Keeping occasional exports is still recommended for important personal collections.

---

## Security Notes

- Never expose a Supabase service-role key in the frontend.
- Use the publishable/anon client key in the browser.
- Keep Row Level Security enabled.
- Perform privileged operations server-side.
- Treat exported VALOWISH JSON files as personal application data.
- Host production deployments over HTTPS.
- Keep Supabase and other dependencies updated when maintaining a deployment.

---

## External Services

VALOWISH relies on external services for some functionality.

### VALORANT skin data

Skin metadata/artwork is retrieved from a public VALORANT data API used by the application.

If that external API is unavailable, live skin loading may be affected.

### Supabase

Supabase provides authentication and cloud-data infrastructure in v3.0.

Cloud features require a working internet connection and a correctly configured Supabase project.

Local functionality can still use browser storage, subject to the app and browser environment.

---

## Pricing Disclaimer

VALOWISH pricing is intended for personal planning.

Default rarity prices are configurable, and individual skins can use manual overrides because cosmetic pricing does not always fit a single universal value.

Always verify actual store pricing in VALORANT before making a real purchase.

---

## Riot Games Disclaimer

**VALOWISH is an independent fan-made/personal project and is not affiliated with, endorsed by, sponsored by, or officially connected to Riot Games.**

VALORANT and related names, trademarks, artwork, and game assets belong to their respective owners.

VALOWISH does not sell VALORANT skins, does not process Riot purchases, and does not provide Riot Points.

---

## Version History

### v1.x - Foundation

Established the core VALOWISH experience: skin browsing, Wishlist, Locker, Priority, VP tracking, custom filtering, and the dark VALORANT-inspired interface.

### v2.0 - Pricing, History & Responsive Foundation

Introduced configurable rarity pricing, custom pricing foundations, History, Undo/Redo, and expanded responsive behavior.

### v2.1 - Price Editing & Responsive UI

Expanded individual price editing throughout the application and significantly improved mobile/tablet layouts.

### v2.2 - Mobile Navigation & Branding

Introduced app-style mobile/tablet navigation and expanded VALOWISH branding.

### v2.3 - Priority Management

Added Move Up/Down controls, direct rank jumping, auto-scroll feedback, and better management for large Priority Lists.

### v2.4 - Navigation Cleanup

Removed the oversized center Priority hub and restored Priority as a clean, standard mobile navigation tab.

### v3.0 - Cloud & Final Major Release

Introduced VALOWISH accounts, authentication, cloud synchronization, profile management, per-user cloud storage, Row Level Security, and secure account-deletion architecture.

---

## Who is VALOWISH for?

VALOWISH is useful for players who:

- Have many VALORANT skins on their wishlist
- Want to rank future purchases
- Want to plan how much VP they need
- Want to track an owned collection
- Want custom price estimates
- Want a history of wishlist/purchase activity
- Want their tracker available beyond one browser
- Prefer a dedicated VALORANT-themed interface over a spreadsheet

---

## Project Goal

VALOWISH was never intended to decide what a player should buy.

Its purpose is to give the player better tools to organize their own decisions.

You decide what you like.

You decide what is worth buying.

VALOWISH keeps the collection organized.

---

## Author

**Alex Godly**

VALOWISH was designed and developed as a personal VALORANT skin management project.

---

## Final Release

**VALOWISH v3.0** completes the original project vision by combining:

**Discovery. Wishlist. Priority. Pricing. VP Planning. Locker. History. Backups. Accounts. Cloud Sync.**

### Your skins. Your wishlist. Your priorities. Your collection.

**VALOWISH - Built by Alex Godly.**
