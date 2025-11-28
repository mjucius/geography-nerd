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
