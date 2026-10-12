# VALOWISH v15 REBORN — White Screen Recovery

## Root cause
The prior Preview 1 ZIP contained raw React/TypeScript (`/src/main.tsx`) as the HTML entry; it required npm dependencies and Vite compilation. Browser and unbuilt GitHub Pages could not execute the source directly.

## Fixes
- Replaced the unusable source entry with a working **static `index.html`**, local CSS and plain browser JavaScript.
- Eliminated npm/Vite as runtime prerequisites for this deployment package.
- Built responsive desktop/mobile REBORN navigation and page layouts, with functioning collection, catalog, priority, planner, details and preferences flows.
- Added API failure isolation: cloud/API failures cannot cause a blank app shell.
- Added legacy data migration and backups.
- Corrected mobile bottom navigation centering/overflow.
- Retained approved favicon and relative GitHub Pages URLs.

## Testing
JS syntax and static asset checks pass; automated mocked-browser smoke testing passes for core interactions. Production Supabase sync, full external catalog coverage and complete React feature parity remain unverified.

## Deployment
This ZIP contains a build-free runnable website. The live GitHub repository has not been modified.
