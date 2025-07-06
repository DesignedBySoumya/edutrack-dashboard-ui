-- Check user_daily_study_sessions table structure
-- Run this in Supabase SQL Editor to see the table structure

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_daily_study_sessions'
) as table_exists;

-- 2. Show table structure if it exists
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

-- 3. Show table constraints
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'user_daily_study_sessions' 
AND table_schema = 'public';

-- 4. Show primary key and unique constraints
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_daily_study_sessions' 
AND tc.table_schema = 'public'
AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE');

-- 5. If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.user_daily_study_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subject_id, date)
);

-- 6. Add RLS policies
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can insert their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.user_daily_study_sessions;

-- Create policies
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