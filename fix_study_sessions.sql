-- Fix user_daily_study_sessions table structure
-- Run this in Supabase SQL Editor

-- 1. Drop the existing table if it has wrong structure
DROP TABLE IF EXISTS public.user_daily_study_sessions;

-- 2. Create the table with correct structure
CREATE TABLE public.user_daily_study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE,
  subtopic_id INTEGER REFERENCES public.subtopics(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN ended_at IS NOT NULL THEN 
        EXTRACT(EPOCH FROM (ended_at - started_at)) / 60
      ELSE 0
    END
  ) STORED,
  session_type TEXT DEFAULT 'focus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies
DROP POLICY IF EXISTS "Users can read their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can insert their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.user_daily_study_sessions;

-- 5. Create new policies
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

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_user_id ON public.user_daily_study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_subject_id ON public.user_daily_study_sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_subtopic_id ON public.user_daily_study_sessions(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_started_at ON public.user_daily_study_sessions(started_at);

-- 7. Show the final table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_daily_study_sessions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Test insert (optional - remove after testing)
-- INSERT INTO public.user_daily_study_sessions (user_id, subject_id, session_type, duration_minutes)
-- VALUES ('your-user-id-here', 1, 'test', 10); 