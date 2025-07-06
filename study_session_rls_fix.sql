-- Study Session RLS Fix Script
-- Run this in Supabase SQL Editor to ensure study sessions can be logged properly

-- 1. Enable RLS on user_daily_study_sessions table
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can insert their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.user_daily_study_sessions;

-- 3. Create separate policies for each operation
-- SELECT policy
CREATE POLICY "Users can read their own study sessions"
  ON public.user_daily_study_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert their own study sessions"
  ON public.user_daily_study_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own study sessions"
  ON public.user_daily_study_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own study sessions"
  ON public.user_daily_study_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Verify the table structure (optional - run this to check)
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable, 
--   column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'user_daily_study_sessions' 
-- AND table_schema = 'public'
-- ORDER BY ordinal_position;

-- 5. Test queries to verify policies work
-- Note: These will only work when authenticated
-- SELECT * FROM user_daily_study_sessions WHERE user_id = auth.uid() LIMIT 5;

-- 6. Check if table exists and has correct structure
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_daily_study_sessions') THEN
    RAISE NOTICE 'Table user_daily_study_sessions exists';
  ELSE
    RAISE NOTICE 'Table user_daily_study_sessions does not exist - you may need to create it first';
  END IF;
END $$;

-- 7. Show current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_daily_study_sessions'; 