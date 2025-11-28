# Database Migrations

This directory contains SQL migrations for the Geography Nerd database. Migrations follow Supabase's standard naming convention with timestamps.

## Migration Files

Migrations are applied in order and should be run sequentially:

### 20231127000001_init_schema.sql
Creates the initial database schema:
- Enables PostGIS extension
- Creates `cities` table with PostGIS geography support
- Creates `user_profiles` table for user data
- Creates `quiz_sessions` table for quiz attempt tracking
- Creates `quiz_responses` table for individual answer storage
- Creates all necessary indexes

### 20231127000002_enable_rls_policies.sql
Enables Row-Level Security (RLS) policies:
- Cities: Public read access for all users
- User profiles: Each user can only see their own profile
- Quiz sessions: Users can only see their own quiz sessions
- Quiz responses: Users can only see responses from their own sessions

### 20231127000003_import_cities.sql
Imports the top 1,000 cities from GeoNames with regional weighting:
- Europe: 400 cities
- Americas: 300 cities
- Asia: 150 cities
- Africa: 100 cities
- Oceania: 50 cities

Generated from the [GeoNames cities1000.zip dataset](https://www.geonames.org/).

## How to Apply Migrations

### Using Supabase CLI (Recommended)

1. Install Supabase CLI if not already installed:
   ```bash
   brew install supabase/tap/supabase
   ```

2. Create a Supabase project and get your credentials

3. Link your project:
   ```bash
   cd backend
   supabase link --project-id YOUR_PROJECT_ID
   ```

4. Apply all migrations:
   ```bash
   supabase db push
   ```

This will automatically apply all migrations in the correct order.

### Manual Application via Supabase Dashboard

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New query**
3. For each migration file (in order):
   - Open the migration file (e.g., `20231127000001_init_schema.sql`)
   - Copy the entire contents
   - Paste into the SQL editor
   - Click **Run**

## Verifying Migrations

After applying migrations, verify the schema was created correctly:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check cities were imported
SELECT COUNT(*) FROM cities;

-- Check RLS policies are enabled
SELECT * FROM pg_tables
WHERE tablename IN ('cities', 'user_profiles', 'quiz_sessions', 'quiz_responses')
AND rowsecurity = true;
```

## Regenerating Cities Data (Optional)

If you want to regenerate the cities data from scratch, run the import script:

```bash
cd backend
node import-cities.js
```

This will:
- Download GeoNames `cities1000.zip` file (~10 MB)
- Extract the `cities1000.txt` file from the ZIP (~28 MB)
- Parse and select the top 1,000 cities
- Generate a new `cities-import.sql` file

You can then create a new migration (e.g., `20231128000004_update_cities.sql`) with the updated data.
