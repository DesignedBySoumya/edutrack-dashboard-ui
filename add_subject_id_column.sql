-- Add subject_id column to user_daily_study_sessions table
-- Run this in Supabase SQL Editor

-- 1. Add the subject_id column
ALTER TABLE public.user_daily_study_sessions 
ADD COLUMN IF NOT EXISTS subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE;

-- 2. Show the updated table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_daily_study_sessions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Update existing records to have subject_id (optional)
-- This will set subject_id based on the subtopic's chapter's subject
-- Uncomment if you want to populate existing records
/*
UPDATE public.user_daily_study_sessions 
SET subject_id = (
  SELECT s.subject_id 
  FROM public.chapters c 
  JOIN public.subtopics st ON c.id = st.chapter_id 
  JOIN public.subjects s ON c.subject_id = s.id 
  WHERE st.id = user_daily_study_sessions.subtopic_id
)
WHERE subject_id IS NULL;
*/

-- 4. Verify the column was added
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_daily_study_sessions' 
AND table_schema = 'public'
AND column_name = 'subject_id'; 