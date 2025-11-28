-- Add difficulty_level column to quiz_sessions table
ALTER TABLE quiz_sessions
ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1;

-- Create city_pair_difficulty table to track question difficulty statistics
CREATE TABLE IF NOT EXISTS city_pair_difficulty (
  id BIGSERIAL PRIMARY KEY,
  city_1_id BIGINT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  city_2_id BIGINT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(city_1_id, city_2_id, difficulty_level)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS city_pair_difficulty_level_idx ON city_pair_difficulty(difficulty_level);
CREATE INDEX IF NOT EXISTS city_pair_difficulty_city_1_idx ON city_pair_difficulty(city_1_id);
CREATE INDEX IF NOT EXISTS city_pair_difficulty_city_2_idx ON city_pair_difficulty(city_2_id);
CREATE INDEX IF NOT EXISTS city_pair_difficulty_stats_idx ON city_pair_difficulty(correct_count, incorrect_count);

-- Add is_capital and region columns to cities table for better filtering
ALTER TABLE cities
ADD COLUMN IF NOT EXISTS is_capital BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS region VARCHAR(100);

-- Create indexes for these new columns
CREATE INDEX IF NOT EXISTS cities_is_capital_idx ON cities(is_capital);
CREATE INDEX IF NOT EXISTS cities_region_idx ON cities(region);
