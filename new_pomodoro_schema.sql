-- Drop old table if it exists
DROP TABLE IF EXISTS user_daily_study_sessions CASCADE;

-- Create new user_daily_study_sessions table with proper schema
CREATE TABLE user_daily_study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL,
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

-- Create new user_subject_stats table
CREATE TABLE user_subject_stats (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_active 
ON user_daily_study_sessions(user_id, subject_id, status) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_user_subject 
ON user_daily_study_sessions(user_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_user_subject_stats_user_subject 
ON user_subject_stats(user_id, subject_id);

-- Enable RLS
ALTER TABLE user_daily_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subject_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_daily_study_sessions
CREATE POLICY "Users can view own study sessions" ON user_daily_study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON user_daily_study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions" ON user_daily_study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions" ON user_daily_study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_subject_stats
CREATE POLICY "Users can view own subject stats" ON user_subject_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subject stats" ON user_subject_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subject stats" ON user_subject_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subject stats" ON user_subject_stats
  FOR DELETE USING (auth.uid() = user_id);

-- Add comments for clarity
COMMENT ON TABLE user_daily_study_sessions IS 'Stores individual Pomodoro study sessions with timer state';
COMMENT ON TABLE user_subject_stats IS 'Stores aggregated statistics for each user-subject combination';
COMMENT ON COLUMN user_daily_study_sessions.session_type IS 'Type of session: focus, short_break, long_break';
COMMENT ON COLUMN user_daily_study_sessions.duration_minutes IS 'Duration of the session in minutes';
COMMENT ON COLUMN user_daily_study_sessions.remaining_seconds IS 'Remaining seconds in the timer';
COMMENT ON COLUMN user_daily_study_sessions.status IS 'Session status: active, completed, canceled'; 