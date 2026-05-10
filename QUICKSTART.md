# Quick Start

```bash
npm install
npm run dev:web
```

Open `http://localhost:5173`.

No Supabase project or `.env.local` file is required for local development.

## Optional Hosted Supabase Mode

```bash
cd web
cp .env.example .env.local
```

Set:

```bash
VITE_CITY_DATA_SOURCE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then initialize Supabase with `supabase/schema.sql` and `supabase/cities-import.sql`.
