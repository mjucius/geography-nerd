-- Disable RLS for quiz tables to support anonymous/public quiz sessions
-- This migration is needed because the app now supports anonymous quiz submissions
-- without requiring user authentication

-- Drop old RLS policies on quiz_sessions
DROP POLICY IF EXISTS "Users can view their own quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can insert their own quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can update their own quiz sessions" ON quiz_sessions;

-- Drop old RLS policies on quiz_responses
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON quiz_responses;

-- Drop old RLS policies on user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Disable RLS on quiz tables (public/anonymous app)
ALTER TABLE quiz_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
