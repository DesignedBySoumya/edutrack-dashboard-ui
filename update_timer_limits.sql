-- Update timer settings table to allow longer durations (up to 180 minutes)
-- Drop existing constraints
ALTER TABLE user_timer_settings DROP CONSTRAINT IF EXISTS user_timer_settings_focus_duration_check;
ALTER TABLE user_timer_settings DROP CONSTRAINT IF EXISTS user_timer_settings_long_break_duration_check;

-- Add new constraints with updated limits
ALTER TABLE user_timer_settings ADD CONSTRAINT user_timer_settings_focus_duration_check 
    CHECK (focus_duration >= 1 AND focus_duration <= 180);

ALTER TABLE user_timer_settings ADD CONSTRAINT user_timer_settings_long_break_duration_check 
    CHECK (long_break_duration >= 1 AND long_break_duration <= 180);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_timer_settings' 
AND column_name IN ('focus_duration', 'break_duration', 'long_break_duration');

-- Show the constraints
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'user_timer_settings'::regclass 
AND contype = 'c'; 