-- Create timer_settings table to store user's custom Pomodoro preferences
CREATE TABLE IF NOT EXISTS user_timer_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    focus_duration INTEGER DEFAULT 25 CHECK (focus_duration >= 1 AND focus_duration <= 60),
    break_duration INTEGER DEFAULT 5 CHECK (break_duration >= 1 AND break_duration <= 30),
    long_break_duration INTEGER DEFAULT 20 CHECK (long_break_duration >= 1 AND long_break_duration <= 60),
    auto_start_next BOOLEAN DEFAULT false,
    sound_notifications BOOLEAN DEFAULT true,
    long_break_interval INTEGER DEFAULT 4 CHECK (long_break_interval >= 1 AND long_break_interval <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_timer_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own timer settings" ON user_timer_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own timer settings" ON user_timer_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timer settings" ON user_timer_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timer settings" ON user_timer_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_timer_settings_updated_at 
    BEFORE UPDATE ON user_timer_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings for existing users (optional)
-- This can be run after the table is created to set default values
-- INSERT INTO user_timer_settings (user_id, focus_duration, break_duration, long_break_duration, auto_start_next, sound_notifications, long_break_interval)
-- SELECT id, 25, 5, 20, false, true, 4 FROM auth.users WHERE id NOT IN (SELECT user_id FROM user_timer_settings); 