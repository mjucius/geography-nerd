# Geography Nerd

Geography Nerd is a browser game that tests directional geography: given two cities, decide whether one is north, south, east, or west of the other.

The app is intentionally simple for open-source use:

- No accounts
- No app-level analytics
- No quiz/session/answer tracking
- No ads
- Local city data by default
- Optional Supabase city data source for hosted deployments

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Leaflet
- Optional Supabase read-only city database

## Quick Start

Requirements:

- Node.js 18+
- npm

```bash
npm install
npm run dev:web
```

The app runs at `http://localhost:5173` and does not require environment variables in local mode.

## Data Source Modes

Local mode is the default. It uses `web/src/data/localCities.ts`, generated from the checked-in city import SQL:

```bash
npm run generate:local-cities
```

Hosted Supabase mode is optional. Set these variables in `web/.env.local` or your host:

```bash
VITE_CITY_DATA_SOURCE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If `VITE_CITY_DATA_SOURCE=supabase` is not set, or Supabase credentials are missing, the app uses local data.

## Supabase Setup

Supabase is only used as a public read-only city database.

1. Create a Supabase project.
2. Run `supabase/schema.sql` or apply the migration in `supabase/migrations/`.
3. Run `supabase/cities-import.sql` in the SQL editor.
4. Set the Supabase environment variables for your hosted web app.

The schema does not create auth, profiles, quiz sessions, quiz responses, or progress tables.

## Scripts

```bash
npm run dev:web
npm run build:web
npm run lint -w web
npm run generate:local-cities
npm run import-cities -w supabase
```

## Privacy

The application does not create user accounts, persist quiz state, store answers, or include app-level tracking/ads. See `PRIVACY.md` for external service notes.

## Attribution

City data is derived from GeoNames. Maps use OpenStreetMap-derived tiles through CARTO. See `ATTRIBUTION.md`.

## License

Code is licensed under MIT. Data and map sources retain their own licenses and attribution requirements.

## Maintainer Notes

Do not commit local environment or Supabase CLI state:

- `web/.env.local`
- `supabase/.temp/`
- `supabase/.branches/`
- `.claude/`

For the first public release, prefer creating a fresh public repository from this cleaned working tree instead of publishing the old private Git history.
