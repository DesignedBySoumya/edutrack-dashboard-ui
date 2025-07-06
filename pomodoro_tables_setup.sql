-- Pomodoro Tables Setup Script
-- Run this in your Supabase SQL editor

-- 1. Create user_daily_study_sessions table
CREATE TABLE IF NOT EXISTS public.user_daily_study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subtopic_id INTEGER REFERENCES public.subtopics(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    session_type TEXT CHECK (session_type IN ('focus', 'break')) DEFAULT 'focus' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create user_subtopic_progress table
CREATE TABLE IF NOT EXISTS public.user_subtopic_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subtopic_id INTEGER REFERENCES public.subtopics(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    time_spent_minutes INTEGER DEFAULT 0 NOT NULL,
    last_studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, subtopic_id)
);

-- 3. Create computed column for duration_minutes in user_daily_study_sessions
-- This calculates the duration in minutes between started_at and ended_at
CREATE OR REPLACE FUNCTION calculate_duration_minutes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
        NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at)) / 60;
    ELSE
        NEW.duration_minutes := 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the computed column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_daily_study_sessions' 
        AND column_name = 'duration_minutes'
    ) THEN
        ALTER TABLE public.user_daily_study_sessions 
        ADD COLUMN duration_minutes INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create trigger for duration calculation
DROP TRIGGER IF EXISTS calculate_duration_trigger ON public.user_daily_study_sessions;
CREATE TRIGGER calculate_duration_trigger
    BEFORE INSERT OR UPDATE ON public.user_daily_study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_duration_minutes();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.user_daily_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subtopic_progress ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for user_daily_study_sessions
-- Policy for users to view their own sessions
CREATE POLICY "Users can view their own study sessions" ON public.user_daily_study_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own sessions
CREATE POLICY "Users can insert their own study sessions" ON public.user_daily_study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own sessions
CREATE POLICY "Users can update their own study sessions" ON public.user_daily_study_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own sessions
CREATE POLICY "Users can delete their own study sessions" ON public.user_daily_study_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create RLS policies for user_subtopic_progress
-- Policy for users to view their own progress
CREATE POLICY "Users can view their own progress" ON public.user_subtopic_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own progress
CREATE POLICY "Users can insert their own progress" ON public.user_subtopic_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own progress
CREATE POLICY "Users can update their own progress" ON public.user_subtopic_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own progress
CREATE POLICY "Users can delete their own progress" ON public.user_subtopic_progress
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_user_id ON public.user_daily_study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_subtopic_id ON public.user_daily_study_sessions(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_started_at ON public.user_daily_study_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_user_subtopic_progress_user_id ON public.user_subtopic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subtopic_progress_subtopic_id ON public.user_subtopic_progress(subtopic_id);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Add updated_at triggers
DROP TRIGGER IF EXISTS update_user_daily_study_sessions_updated_at ON public.user_daily_study_sessions;
CREATE TRIGGER update_user_daily_study_sessions_updated_at
    BEFORE UPDATE ON public.user_daily_study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subtopic_progress_updated_at ON public.user_subtopic_progress;
CREATE TRIGGER update_user_subtopic_progress_updated_at
    BEFORE UPDATE ON public.user_subtopic_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Verify tables exist
SELECT 
    'user_daily_study_sessions' as table_name,
    COUNT(*) as row_count
FROM public.user_daily_study_sessions
UNION ALL
SELECT 
    'user_subtopic_progress' as table_name,
    COUNT(*) as row_count
FROM public.user_subtopic_progress; 