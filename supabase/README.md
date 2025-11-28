# Geography Nerd - Backend Setup

This directory contains the database schema and data import scripts for the Geography Nerd application.

## Supabase Setup

### Prerequisites
- A Supabase account (free tier available at https://supabase.com)

### Applying Database Migrations

All database schema and data are provided as numbered migrations in the `migrations/` directory. Migrations follow Supabase's naming convention and should be applied in order.

#### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   brew install supabase/tap/supabase
   ```

2. Create a Supabase project at https://supabase.com

3. Link your local project:
   ```bash
   supabase link --project-id YOUR_PROJECT_ID
   ```
   (Get your Project ID from Supabase dashboard → Settings → General)

4. Apply all migrations:
   ```bash
   supabase db push
   ```

This will automatically apply all migrations in the correct order:
- `20231127000001_init_schema.sql` - Creates tables and indexes
- `20231127000002_enable_rls_policies.sql` - Enables Row-Level Security
- `20231127000003_import_cities.sql` - Imports 1,000 cities

#### Option 2: Manual Application via Supabase Dashboard

1. Create a Supabase project at https://supabase.com

2. In the dashboard, go to **SQL Editor** (left sidebar)

3. For each migration file (in order):
   - Click **New query**
   - Open the migration file in your text editor
   - Copy the entire contents
   - Paste into the SQL editor
   - Click **Run**
   - Wait for completion

Apply in this order:
1. `migrations/20231127000001_init_schema.sql`
2. `migrations/20231127000002_enable_rls_policies.sql`
3. `migrations/20231127000003_import_cities.sql` (takes 1-2 minutes)

#### Verify Migrations

After applying migrations, verify everything was created correctly:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check cities were imported (should return ~1,000)
SELECT COUNT(*) FROM cities;

-- Verify RLS is enabled
SELECT * FROM pg_tables
WHERE tablename IN ('cities', 'user_profiles', 'quiz_sessions', 'quiz_responses')
AND rowsecurity = true;
```

### Regenerating Cities Data (Optional)

If you want to regenerate the cities data from scratch:

```bash
node import-cities.js
```

This will:
- Download the GeoNames `cities1000.zip` file (~10 MB)
- Extract the `cities1000.txt` file from the ZIP (~28 MB)
- Parse and select the top 1,000 cities
- Generate a new `cities-import.sql` file

You can then create a new migration file (e.g., `20231128000004_update_cities.sql`) with the updated data and commit it to version control.

## Database Schema Details

### Cities Table
Stores geographic city data with PostGIS point geometry for spatial queries.

```sql
CREATE TABLE cities (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  population INTEGER,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Quiz Sessions Table
Tracks each user's quiz attempts with metadata.

```sql
CREATE TABLE quiz_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 10,
  question_type VARCHAR(50) DEFAULT 'direction',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Quiz Responses Table
Stores individual answer responses for analytics.

```sql
CREATE TABLE quiz_responses (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES quiz_sessions(id),
  city_1_id BIGINT REFERENCES cities(id),
  city_2_id BIGINT REFERENCES cities(id),
  question_text TEXT,
  user_answer VARCHAR(50),
  correct_answer VARCHAR(50),
  is_correct BOOLEAN,
  answered_at TIMESTAMP DEFAULT NOW()
);
```

## Row-Level Security (RLS)

All tables have RLS policies enabled to ensure:
- Users can only see their own quiz data
- Cities are publicly readable
- Each user's profile is private

## Supabase Configuration

### Environment Variables

In the web application, set these environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
1. Supabase Dashboard → Settings → API
2. Copy the Project URL and anon (public) key

### Enable Authentication

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable "Email" authentication
3. Optionally enable OAuth providers (Google, GitHub, etc.)

### PostGIS Extension

The schema.sql automatically enables the PostGIS extension. If it's not enabled:
1. Go to Supabase Dashboard → Extensions
2. Search for "postgis"
3. Click "Install"

## Future Enhancements

- Pre-generate and cache question sets
- Add leaderboard queries
- Implement user statistics aggregation
- Archive old quiz responses for performance
- Add monthly data partitioning for large datasets
