-- Dashboard Database Setup Script
-- Run this in your Supabase SQL Editor to ensure all required tables exist

-- 1. Create user_daily_study_sessions table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_daily_study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id INTEGER,
  session_type TEXT NOT NULL DEFAULT 'focus',
  duration_minutes INTEGER NOT NULL DEFAULT 25,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paused_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  is_paused BOOLEAN DEFAULT FALSE,
  remaining_seconds INTEGER NOT NULL DEFAULT 1500,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user_subject_stats table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_subject_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL,
  total_focus_seconds INTEGER DEFAULT 0,
  sessions_completed INTEGER DEFAULT 0,
  last_session_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subject_id)
);

-- 3. Create mock_tests table (if not exists)
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id INTEGER DEFAULT 1,
  pts_year TEXT DEFAULT '2025-2026',
  test_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  rank INTEGER DEFAULT 1200,
  percentile DECIMAL(5,2) DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create battle_logs table (if not exists)
CREATE TABLE IF NOT EXISTS public.battle_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  question_id UUID,
  selected_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER,
  confidence_level TEXT CHECK (confidence_level IN ('Low', 'Medium', 'High')),
  battle_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  question_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create review_sessions table (if not exists)
CREATE TABLE IF NOT EXISTS public.review_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  cards_reviewed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_user_id 
ON public.user_daily_study_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_started_at 
ON public.user_daily_study_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_status 
ON public.user_daily_study_sessions(status);

CREATE INDEX IF NOT EXISTS idx_mock_tests_user_id 
ON public.mock_tests(user_id);

CREATE INDEX IF NOT EXISTS idx_mock_tests_created_at 
ON public.mock_tests(created_at);

CREATE INDEX IF NOT EXISTS idx_battle_logs_user_id 
ON public.battle_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_battle_logs_created_at 
ON public.battle_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_review_sessions_user_id 
ON public.review_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_review_sessions_created_at 
ON public.review_sessions(created_at);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subject_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_sessions ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for user_daily_study_sessions
DROP POLICY IF EXISTS "Users can view own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can insert own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can update own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can delete own study sessions" ON public.user_daily_study_sessions;

CREATE POLICY "Users can view own study sessions" ON public.user_daily_study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON public.user_daily_study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions" ON public.user_daily_study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions" ON public.user_daily_study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create RLS policies for user_subject_stats
DROP POLICY IF EXISTS "Users can view own subject stats" ON public.user_subject_stats;
DROP POLICY IF EXISTS "Users can insert own subject stats" ON public.user_subject_stats;
DROP POLICY IF EXISTS "Users can update own subject stats" ON public.user_subject_stats;
DROP POLICY IF EXISTS "Users can delete own subject stats" ON public.user_subject_stats;

CREATE POLICY "Users can view own subject stats" ON public.user_subject_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subject stats" ON public.user_subject_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subject stats" ON public.user_subject_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subject stats" ON public.user_subject_stats
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Create RLS policies for mock_tests
DROP POLICY IF EXISTS "Users can view own mock tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Users can insert own mock tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Users can update own mock tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Users can delete own mock tests" ON public.mock_tests;

CREATE POLICY "Users can view own mock tests" ON public.mock_tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mock tests" ON public.mock_tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mock tests" ON public.mock_tests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mock tests" ON public.mock_tests
  FOR DELETE USING (auth.uid() = user_id);

-- 11. Create RLS policies for battle_logs
DROP POLICY IF EXISTS "Users can view own battle logs" ON public.battle_logs;
DROP POLICY IF EXISTS "Users can insert own battle logs" ON public.battle_logs;
DROP POLICY IF EXISTS "Users can update own battle logs" ON public.battle_logs;
DROP POLICY IF EXISTS "Users can delete own battle logs" ON public.battle_logs;

CREATE POLICY "Users can view own battle logs" ON public.battle_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own battle logs" ON public.battle_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own battle logs" ON public.battle_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own battle logs" ON public.battle_logs
  FOR DELETE USING (auth.uid() = user_id);

-- 12. Create RLS policies for review_sessions
DROP POLICY IF EXISTS "Users can view own review sessions" ON public.review_sessions;
DROP POLICY IF EXISTS "Users can insert own review sessions" ON public.review_sessions;
DROP POLICY IF EXISTS "Users can update own review sessions" ON public.review_sessions;
DROP POLICY IF EXISTS "Users can delete own review sessions" ON public.review_sessions;

CREATE POLICY "Users can view own review sessions" ON public.review_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own review sessions" ON public.review_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own review sessions" ON public.review_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own review sessions" ON public.review_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- 13. Insert sample data for testing (optional - remove in production)
-- Uncomment the following lines to insert sample data for testing

/*
-- Sample study sessions
INSERT INTO public.user_daily_study_sessions (user_id, subject_id, session_type, duration_minutes, status, started_at)
VALUES 
  ('your-user-id-here', 1, 'focus', 25, 'completed', NOW() - INTERVAL '1 day'),
  ('your-user-id-here', 2, 'focus', 30, 'completed', NOW() - INTERVAL '2 days'),
  ('your-user-id-here', 1, 'focus', 20, 'completed', NOW() - INTERVAL '3 days');

-- Sample mock tests
INSERT INTO public.mock_tests (user_id, total_score, accuracy, created_at)
VALUES 
  ('your-user-id-here', 85, 85.5, NOW() - INTERVAL '1 day'),
  ('your-user-id-here', 78, 78.0, NOW() - INTERVAL '3 days'),
  ('your-user-id-here', 92, 92.0, NOW() - INTERVAL '5 days');

-- Sample battle logs
INSERT INTO public.battle_logs (user_id, session_id, is_correct, time_spent, confidence_level)
VALUES 
  ('your-user-id-here', 'session1', true, 25, 'High'),
  ('your-user-id-here', 'session1', false, 45, 'Medium'),
  ('your-user-id-here', 'session1', true, 30, 'High');

-- Sample review sessions
INSERT INTO public.review_sessions (user_id, correct_count, incorrect_count, accuracy, total_xp_earned, streak_count, level, cards_reviewed)
VALUES 
  ('your-user-id-here', 15, 5, 75.0, 40, 3, 2, 20),
  ('your-user-id-here', 18, 2, 90.0, 40, 4, 2, 20),
  ('your-user-id-here', 12, 8, 60.0, 40, 1, 1, 20);
*/

-- 14. Verify table creation
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'user_daily_study_sessions',
  'user_subject_stats', 
  'mock_tests',
  'battle_logs',
  'review_sessions'
)
ORDER BY table_name; 