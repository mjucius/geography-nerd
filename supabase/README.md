# Supabase Setup

Supabase is optional. The app runs with bundled local city data by default.

Use Supabase only when you want a hosted public city database for your deployed game.

## Fresh Project Setup

1. Create a Supabase project.
2. Run `schema.sql` in the SQL editor, or apply `migrations/20260502000001_public_city_schema.sql`.
3. Run `cities-import.sql` in the SQL editor.
4. Configure the web app:

```bash
VITE_CITY_DATA_SOURCE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Schema

The public schema contains only:

- `countries`
- `cities`

Both tables have row-level security enabled with public read policies. There are no auth, profile, quiz session, quiz response, user progress, or answer analytics tables.

## Updating City Data

`cities-import.sql` is generated from GeoNames data. To regenerate it:

```bash
npm run import-cities -w supabase
npm run generate:local-cities
```

Keep `ATTRIBUTION.md` intact when changing data sources.

## Existing Hosted Projects

If an older deployed Supabase project has account/session/progress tables, do not drop them until you have exported or intentionally discarded that data.

After backup, remove obsolete tables manually:

```sql
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS quiz_sessions CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS city_pair_difficulty CASCADE;
```

Then apply the current public city schema.
