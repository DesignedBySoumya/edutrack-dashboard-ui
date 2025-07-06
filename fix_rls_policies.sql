-- Fix RLS Policies for Pomodoro Tables
-- Run this in your Supabase SQL editor

-- ========================================
-- 1. FIX user_subtopic_progress TABLE
-- ========================================

-- First, enable RLS if not already enabled
ALTER TABLE public.user_subtopic_progress ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Select own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Insert own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Update own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Delete own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_subtopic_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_subtopic_progress;

-- Create separate policies for each operation
-- 1️⃣ SELECT policy
CREATE POLICY "Select own progress"
ON public.user_subtopic_progress
FOR SELECT
USING (auth.uid() = user_id);

-- 2️⃣ INSERT policy
CREATE POLICY "Insert own progress"
ON public.user_subtopic_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3️⃣ UPDATE policy
CREATE POLICY "Update own progress"
ON public.user_subtopic_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4️⃣ DELETE policy (optional, for cleanup)
CREATE POLICY "Delete own progress"
ON public.user_subtopic_progress
FOR DELETE
USING (auth.uid() = user_id);

-- ========================================
-- 2. FIX user_daily_study_sessions TABLE
-- ========================================

-- Enable RLS if not already enabled
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Select own sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Insert own sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Update own sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Delete own sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can view their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can insert their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON public.user_daily_study_sessions;
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON public.user_daily_study_sessions;

-- Create separate policies for each operation
-- 1️⃣ SELECT policy
CREATE POLICY "Select own sessions"
ON public.user_daily_study_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- 2️⃣ INSERT policy
CREATE POLICY "Insert own sessions"
ON public.user_daily_study_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3️⃣ UPDATE policy
CREATE POLICY "Update own sessions"
ON public.user_daily_study_sessions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4️⃣ DELETE policy (optional, for cleanup)
CREATE POLICY "Delete own sessions"
ON public.user_daily_study_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- ========================================
-- 3. VERIFY POLICIES ARE CREATED
-- ========================================

-- Check policies for user_subtopic_progress
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
WHERE tablename = 'user_subtopic_progress'
ORDER BY policyname;

-- Check policies for user_daily_study_sessions
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
WHERE tablename = 'user_daily_study_sessions'
ORDER BY policyname;

-- ========================================
-- 4. TEST THE POLICIES
-- ========================================

-- This will show you the current user's ID (run this in SQL editor)
SELECT auth.uid() as current_user_id;

-- Test if you can see your own progress (should return rows if you have any)
SELECT * FROM public.user_subtopic_progress 
WHERE user_id = auth.uid();

-- Test if you can see your own sessions (should return rows if you have any)
SELECT * FROM public.user_daily_study_sessions 
WHERE user_id = auth.uid(); 