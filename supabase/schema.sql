-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  population INTEGER,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_Point(longitude, latitude)::geography
  ) STORED,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cities_location_gist ON cities USING GIST (location);
CREATE INDEX IF NOT EXISTS cities_population_idx ON cities(population DESC);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 10,
  question_type VARCHAR(50) DEFAULT 'direction',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_sessions_user_idx ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS quiz_sessions_completed_idx ON quiz_sessions(completed_at);

-- Quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  city_1_id BIGINT REFERENCES cities(id),
  city_2_id BIGINT REFERENCES cities(id),
  question_text TEXT,
  user_answer VARCHAR(50),
  correct_answer VARCHAR(50),
  is_correct BOOLEAN,
  answered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_responses_session_idx ON quiz_responses(session_id);

-- Row-Level Security Policies

-- Cities: Public read access
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);

-- User profiles: Users can see their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Quiz sessions: Users can only view/insert their own sessions
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own quiz sessions" ON quiz_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz sessions" ON quiz_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quiz sessions" ON quiz_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz responses: Users can only view/insert their own responses
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own quiz responses" ON quiz_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE quiz_sessions.id = quiz_responses.session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert their own quiz responses" ON quiz_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE quiz_sessions.id = quiz_responses.session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );
