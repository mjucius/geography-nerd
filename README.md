# Geography Nerd 🌍

An interactive trivia website that tests users' geographic knowledge through directional comparison questions between city pairs.

**Goal:** Users answer questions like "Is New York City north or south of Paris, France?" and receive a score based on correct answers.

## Project Overview

- **Phase 1 Focus:** Directional comparison questions (north/south, east/west)
- **Future Phases:** Capital cities, population comparisons, leaderboards, and user progress tracking

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Supabase JavaScript Client** for database access
- **Deployed on Netlify**

### Backend
- **Supabase** (PostgreSQL + PostGIS + Authentication)
- **PostGIS extension** for geospatial queries
- **Row-Level Security** for data isolation

## Project Structure

```
geography-nerd/
├── web/                           # React frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── AuthForm.tsx       # Login/signup form
│   │   │   ├── Navigation.tsx     # Header with user menu
│   │   │   ├── QuestionCard.tsx   # Individual question display
│   │   │   ├── QuizContainer.tsx  # Quiz orchestration
│   │   │   └── ScoreScreen.tsx    # Results display
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.ts         # Authentication state
│   │   │   └── useQuiz.ts         # Quiz state management
│   │   ├── pages/                 # Page components
│   │   │   └── Home.tsx           # Landing page
│   │   ├── services/              # API/utility services
│   │   │   ├── quizService.ts     # Quiz logic
│   │   │   └── supabaseClient.ts  # Supabase initialization
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── .env.example               # Environment variables template
│   ├── vite.config.ts             # Vite configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── package.json               # Web dependencies
├── backend/                       # Database setup and scripts
│   ├── schema.sql                 # Database schema with RLS policies
│   ├── import-cities.js           # GeoNames data import script
│   ├── package.json               # Backend scripts
│   └── README.md                  # Backend setup instructions
├── netlify.toml                   # Netlify deployment configuration
├── package.json                   # Monorepo root configuration
├── GEOGRAPHY_NERD_PLAN.md        # Complete project plan
└── README.md                      # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd geography-nerd
   ```

2. Install dependencies (for both web and backend):
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at https://supabase.com (free tier available)
   - Follow the [Backend Setup Instructions](./backend/README.md)

4. Configure environment variables:
   ```bash
   cd web
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev:web
   ```

   The app will be available at http://localhost:5173

## Database Setup

See [backend/README.md](./backend/README.md) for detailed database setup instructions.

Quick summary:
1. Create Supabase project
2. Enable PostGIS extension
3. Run `backend/schema.sql` in Supabase SQL Editor
4. Run `node backend/import-cities.js` to generate city data
5. Run the generated `cities-import.sql` in Supabase SQL Editor

## Features

### Phase 1 (Current)
✅ User authentication (email/password)
✅ 10-question quizzes with direction-based questions
✅ Questions covering 1,000 global cities
✅ Real-time scoring with instant feedback
✅ Score breakdown showing correct/incorrect answers
✅ Ability to retake quizzes

### Future Phases
- 🔄 Leaderboards and user statistics
- 🏛️ Capital city questions
- 📊 Population comparison questions
- 🌐 Distance-based questions
- 🏆 Achievement badges and streaks
- ⏱️ Timed challenge mode
- 📚 Difficulty levels (easy to hard)

## Development

### Available Scripts

**Web Development:**
```bash
npm run dev:web          # Start Vite dev server
npm run build:web        # Build for production
npm run lint -w web      # Lint React code
```

**Backend:**
```bash
npm run import-cities -w backend  # Import cities from GeoNames
```

**Monorepo:**
```bash
npm run build            # Build both web and backend
```

## Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:web`
3. Set publish directory: `web/dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

5. Deploy!

### Backend (Supabase)

No deployment needed - all database operations are handled through Supabase's managed service.

## Authentication

The app uses Supabase Authentication with:
- Email/password authentication
- JWT tokens managed automatically
- Row-Level Security policies for data isolation

Users can:
- Sign up with email and password
- Sign in to their account
- Sign out
- View their quiz history (Phase 2+)

## API Design

The app uses the **Supabase JavaScript Client** directly in React instead of traditional REST endpoints. This provides:
- Type-safe queries with PostGIS support
- Real-time updates via subscriptions
- Automatic JWT handling
- Built-in RLS enforcement

Key operations:
- `getCities()` - Fetch available cities
- `generateQuestions()` - Create quiz questions
- `createQuizSession()` - Start a new quiz
- `saveQuizResponse()` - Store individual answers
- `completeQuizSession()` - Finalize quiz and calculate score

## Data

### Cities Data
- **Source:** GeoNames (cities1000.txt)
- **Count:** ~1,000 cities
- **Distribution:** 40% Europe, 30% Americas, 15% Asia, 10% Africa, 5% Oceania
- **Includes:** Name, country, population, latitude, longitude

### Quiz Data
- **Questions:** Randomly generated from city pairs
- **Types:** Latitudinal (North/South), Longitudinal (East/West)
- **Responses:** Stored per question for analytics

## Cost Analysis

**Free Tier Coverage:**
- Supabase: 500MB storage (sufficient for MVP)
- Netlify: 100GB bandwidth/month (sufficient)
- Cost at launch: $0/month
- Cost at scale: $25-50/month (Supabase upgrade only)

## Testing

To manually test the application:

1. Sign up with a test email
2. Start a quiz
3. Answer all 10 questions
4. Verify score is calculated correctly
5. Check that answers are stored in database
6. Retake a quiz and verify new session is created

### Geospatial Validation

Test PostGIS queries in Supabase SQL Editor:
```sql
-- Check if city A is north of city B
SELECT ST_Y(location) > (SELECT ST_Y(location) FROM cities WHERE id = 2)
FROM cities WHERE id = 1;

-- Check distances between cities
SELECT ST_Distance(
  (SELECT location FROM cities WHERE id = 1),
  (SELECT location FROM cities WHERE id = 2)
) as distance_meters;
```

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` is created with correct credentials
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Quiz won't start
- Verify cities table has data: `SELECT COUNT(*) FROM cities;`
- Check browser console for errors
- Ensure user is authenticated

### Score seems incorrect
- Verify coordinates in database are correct
- Test latitude/longitude comparison logic in database

## Security

The application implements security through:
- **Row-Level Security (RLS):** Users can only access their own data
- **JWT Authentication:** Secure token-based authentication
- **HTTPS:** All communication encrypted (Netlify + Supabase)
- **Input Validation:** Type-safe queries with Supabase client

## Contributing

The development follows the plan in [GEOGRAPHY_NERD_PLAN.md](./GEOGRAPHY_NERD_PLAN.md).

## Future Roadmap

1. **Phase 2:** Leaderboards and user statistics
2. **Phase 3:** Additional question types (capitals, population, distance, timezone)
3. **Phase 4:** Advanced features (achievements, custom quizzes, timed modes)
4. **Phase 5:** Social features (friends, comparisons, sharing)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [GeoNames Data](https://www.geonames.org/export/city15000.html)
- [React Best Practices](https://react.dev)
- [Netlify Deployment Guide](https://docs.netlify.com/get-started/build-on-netlify/)

## License

MIT

## Author

Created as a geography trivia learning project.

---

**Document version:** 1.0 (Initial Implementation)
**Last updated:** 2025-11-26
