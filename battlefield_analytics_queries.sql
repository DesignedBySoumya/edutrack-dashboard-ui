-- Battlefield Analytics Queries for Supabase
-- These queries extract data from battle_logs table for the analytics dashboard

-- 1. Overall Performance Analytics
-- Gets total sessions, questions, average time, and accuracy
SELECT 
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(*) as total_questions,
  ROUND(AVG(time_spent), 2) as avg_time_spent,
  ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 2) as accuracy_percentage
FROM battle_logs 
WHERE user_id = $1;

-- 2. Beast Mode and Speed Analytics
-- Calculates beast mode (≤30s) and slow (>80s) percentages
SELECT 
  ROUND((COUNT(CASE WHEN time_spent <= 30 THEN 1 END) * 100.0 / COUNT(*)), 2) as beast_mode_percentage,
  ROUND((COUNT(CASE WHEN time_spent > 80 THEN 1 END) * 100.0 / COUNT(*)), 2) as slow_percentage,
  ROUND((COUNT(CASE WHEN time_spent BETWEEN 31 AND 80 THEN 1 END) * 100.0 / COUNT(*)), 2) as normal_speed_percentage
FROM battle_logs 
WHERE user_id = $1;

-- 3. Recent Activity (Last 7 Days)
-- Gets sessions and questions from the last 7 days
SELECT 
  COUNT(DISTINCT session_id) as sessions_last_7_days,
  COUNT(*) as questions_last_7_days,
  ROUND(AVG(time_spent), 2) as avg_time_last_7_days,
  ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 2) as accuracy_last_7_days
FROM battle_logs 
WHERE user_id = $1 
  AND created_at >= NOW() - INTERVAL '7 days';

-- 4. Daily Activity for Streak Calculation
-- Gets unique dates when user had battles
SELECT 
  DATE(created_at) as battle_date,
  COUNT(DISTINCT session_id) as sessions_count,
  COUNT(*) as questions_count
FROM battle_logs 
WHERE user_id = $1 
GROUP BY DATE(created_at)
ORDER BY battle_date DESC;

-- 5. Session-wise Analytics
-- Gets detailed analytics for each battle session
SELECT 
  session_id,
  MIN(created_at) as session_start,
  MAX(created_at) as session_end,
  COUNT(*) as questions_count,
  ROUND(AVG(time_spent), 2) as avg_time_spent,
  ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 2) as accuracy_percentage,
  ROUND((COUNT(CASE WHEN time_spent <= 30 THEN 1 END) * 100.0 / COUNT(*)), 2) as beast_mode_percentage,
  ROUND((COUNT(CASE WHEN time_spent > 80 THEN 1 END) * 100.0 / COUNT(*)), 2) as slow_percentage
FROM battle_logs 
WHERE user_id = $1 
GROUP BY session_id
ORDER BY session_start DESC
LIMIT 20;

-- 6. Improvement Trend Analysis
-- Compares recent sessions vs older sessions for improvement calculation
WITH recent_sessions AS (
  SELECT AVG(time_spent) as recent_avg_time
  FROM battle_logs 
  WHERE user_id = $1 
    AND created_at >= NOW() - INTERVAL '7 days'
),
older_sessions AS (
  SELECT AVG(time_spent) as older_avg_time
  FROM battle_logs 
  WHERE user_id = $1 
    AND created_at >= NOW() - INTERVAL '14 days' 
    AND created_at < NOW() - INTERVAL '7 days'
)
SELECT 
  ROUND(((older.older_avg_time - recent.recent_avg_time) / older.older_avg_time * 100), 2) as improvement_percentage
FROM recent_sessions recent, older_sessions older;

-- 7. Confidence Level Analysis
-- Analyzes how confidence levels correlate with accuracy
SELECT 
  confidence_level,
  COUNT(*) as total_attempts,
  ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 2) as accuracy_percentage,
  ROUND(AVG(time_spent), 2) as avg_time_spent
FROM battle_logs 
WHERE user_id = $1 
GROUP BY confidence_level
ORDER BY confidence_level;

-- 8. Time Distribution Analysis
-- Shows distribution of question completion times
SELECT 
  CASE 
    WHEN time_spent <= 15 THEN 'Very Fast (≤15s)'
    WHEN time_spent <= 30 THEN 'Fast (16-30s)'
    WHEN time_spent <= 60 THEN 'Normal (31-60s)'
    WHEN time_spent <= 80 THEN 'Slow (61-80s)'
    ELSE 'Very Slow (>80s)'
  END as time_category,
  COUNT(*) as question_count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM battle_logs WHERE user_id = $1)), 2) as percentage
FROM battle_logs 
WHERE user_id = $1 
GROUP BY 
  CASE 
    WHEN time_spent <= 15 THEN 'Very Fast (≤15s)'
    WHEN time_spent <= 30 THEN 'Fast (16-30s)'
    WHEN time_spent <= 60 THEN 'Normal (31-60s)'
    WHEN time_spent <= 80 THEN 'Slow (61-80s)'
    ELSE 'Very Slow (>80s)'
  END
ORDER BY 
  CASE time_category
    WHEN 'Very Fast (≤15s)' THEN 1
    WHEN 'Fast (16-30s)' THEN 2
    WHEN 'Normal (31-60s)' THEN 3
    WHEN 'Slow (61-80s)' THEN 4
    WHEN 'Very Slow (>80s)' THEN 5
  END;

-- 9. Weekly Performance Trends
-- Shows performance trends over the last 4 weeks
SELECT 
  DATE_TRUNC('week', created_at) as week_start,
  COUNT(DISTINCT session_id) as sessions_count,
  COUNT(*) as questions_count,
  ROUND(AVG(time_spent), 2) as avg_time_spent,
  ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 2) as accuracy_percentage,
  ROUND((COUNT(CASE WHEN time_spent <= 30 THEN 1 END) * 100.0 / COUNT(*)), 2) as beast_mode_percentage
FROM battle_logs 
WHERE user_id = $1 
  AND created_at >= NOW() - INTERVAL '4 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start DESC;

-- 10. Question Difficulty Analysis (if question_id can be joined with questions table)
-- Analyzes performance by question difficulty or topic
SELECT 
  q.difficulty_level,
  COUNT(bl.*) as attempts,
  ROUND((COUNT(CASE WHEN bl.is_correct = true THEN 1 END) * 100.0 / COUNT(bl.*)), 2) as accuracy_percentage,
  ROUND(AVG(bl.time_spent), 2) as avg_time_spent
FROM battle_logs bl
JOIN questions q ON bl.question_id = q.id
WHERE bl.user_id = $1 
GROUP BY q.difficulty_level
ORDER BY q.difficulty_level; 