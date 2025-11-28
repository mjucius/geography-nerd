-- Row-Level Security Policies
-- Note: RLS disabled for quiz_sessions and quiz_responses since the app is now public/anonymous
-- Cities table has basic public read policy

-- Cities: Public read access
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);
