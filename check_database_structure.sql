-- Check Database Structure
-- Run this in Supabase SQL Editor to see what tables and columns exist

-- 1. List all tables in the public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check if user_daily_study_sessions table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_daily_study_sessions'
) as user_daily_study_sessions_exists;

-- 3. If the table exists, show its structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'user_daily_study_sessions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Show all tables that contain 'session' in the name
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name ILIKE '%session%'
ORDER BY table_name;

-- 5. Show all tables that contain 'study' in the name
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name ILIKE '%study%'
ORDER BY table_name;

-- 6. Show all tables that contain 'daily' in the name
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name ILIKE '%daily%'
ORDER BY table_name;

-- 7. If user_daily_study_sessions doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.user_daily_study_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  session_date DATE DEFAULT CURRENT_DATE,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
DROP POLICY IF EXISTS "Users can read their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can insert their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.user_daily_study_sessions;

CREATE POLICY "Users can read their own study sessions"
  ON public.user_daily_study_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions"
  ON public.user_daily_study_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON public.user_daily_study_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions"
  ON public.user_daily_study_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- 10. Show the final table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_daily_study_sessions' 
AND table_schema = 'public'
ORDER BY ordinal_position; 