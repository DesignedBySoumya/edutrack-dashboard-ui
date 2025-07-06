-- Add timer persistence columns to user_daily_study_sessions
ALTER TABLE user_daily_study_sessions
ADD COLUMN is_paused BOOLEAN DEFAULT FALSE,
ADD COLUMN paused_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN remaining_seconds INTEGER DEFAULT 1500;  -- 25 minutes = 1500 seconds

-- Add index for faster queries on active sessions
CREATE INDEX IF NOT EXISTS idx_user_daily_study_sessions_active 
ON user_daily_study_sessions(user_id, subject_id, is_paused) 
WHERE ended_at IS NULL;

-- Update existing sessions to have default remaining_seconds
UPDATE user_daily_study_sessions 
SET remaining_seconds = 1500 
WHERE remaining_seconds IS NULL AND ended_at IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN user_daily_study_sessions.is_paused IS 'Whether the timer is currently paused';
COMMENT ON COLUMN user_daily_study_sessions.paused_at IS 'Timestamp when the timer was paused';
COMMENT ON COLUMN user_daily_study_sessions.remaining_seconds IS 'Remaining seconds in the timer (1500 = 25 minutes)'; 