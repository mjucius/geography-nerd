# Geography Nerd - Quick Start (5 Minutes)

## TL;DR - Get Running in 5 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase (2 minutes)
1. Go to https://supabase.com and create a free project
2. Copy your **Project URL** and **Anon Key** from Settings → API
3. Note your **Project ID** from Settings → General

### 3. Apply Database Migrations
1. Option A (Recommended): Use Supabase CLI:
   ```bash
   cd backend
   supabase link --project-id YOUR_PROJECT_ID
   supabase db push
   ```

   Option B: Manually run SQL files in Supabase dashboard:
   - Go to SQL Editor
   - Run `backend/migrations/20231127000001_init_schema.sql`
   - Run `backend/migrations/20231127000002_enable_rls_policies.sql`
   - Run `backend/migrations/20231127000003_import_cities.sql`

### 4. Configure Environment
```bash
cd web
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 5. Run!
```bash
npm run dev:web
```
Visit http://localhost:5173 and start playing!

---

## What You Can Do

✅ **Sign Up** - Create account with email/password
✅ **Play Quiz** - Answer 10 geography direction questions
✅ **See Results** - Get instant score and answer breakdown
✅ **Retake** - Generate new quiz with different questions

---

## Test Account

Once running, you can:
1. Sign up with any email (e.g., `test@example.com`)
2. Any password (e.g., `password123`)
3. Click "Start Quiz"
4. Answer all 10 questions
5. See your score!

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| "Cannot find module" | Run `npm install` |
| "Missing env variables" | Check `web/.env.local` has both values |
| "No cities in database" | Verify `cities-import.sql` ran successfully |
| Port 5173 in use | Run on different port: `npm run dev:web -- --port 3000` |

---

## Full Documentation

- **Complete Setup:** [SETUP.md](./SETUP.md)
- **Full README:** [README.md](./README.md)
- **Implementation Details:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Project Plan:** [GEOGRAPHY_NERD_PLAN.md](./GEOGRAPHY_NERD_PLAN.md)

---

## Next: Deploy to Netlify (Optional)

```bash
# Push to GitHub first
git init && git add . && git commit -m "Geography Nerd"
git remote add origin https://github.com/YOUR_USERNAME/geography-nerd.git
git push -u origin main
```

Then connect GitHub repo to Netlify dashboard for auto-deployment!

---

**Ready? Start with Step 1 above!** 🚀
