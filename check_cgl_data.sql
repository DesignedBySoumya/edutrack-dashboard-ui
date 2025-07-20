-- Check CGL Exam Data
-- Run this in Supabase SQL Editor to check for CGL data

-- 1. Check all available exams
SELECT 
  id,
  name,
  created_at
FROM public.exams
ORDER BY name;

-- 2. Check specifically for CGL exam
SELECT 
  id,
  name,
  created_at
FROM public.exams
WHERE name ILIKE '%cgl%' 
   OR name ILIKE '%combined graduate level%'
   OR name ILIKE '%combined graduate%'
ORDER BY name;

-- 3. If CGL exists, check mock data for CGL
-- Replace 'CGL_EXAM_ID' with the actual CGL exam ID from step 2
SELECT 
  id,
  user_id,
  exam_id,
  pts_year,
  test_date,
  total_score,
  accuracy,
  rank,
  percentile,
  created_at
FROM public.mock_tests
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1)
ORDER BY created_at DESC;

-- 4. Check subjects for CGL exam
SELECT 
  id,
  name,
  exam_id,
  order_index,
  color,
  icon,
  maxMarks
FROM public.subjects
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1)
ORDER BY order_index;

-- 5. Check chapters for CGL subjects
SELECT 
  c.id,
  c.name as chapter_name,
  s.name as subject_name,
  c.subject_id,
  c.order_index
FROM public.chapters c
JOIN public.subjects s ON c.subject_id = s.id
WHERE s.exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1)
ORDER BY s.order_index, c.order_index;

-- 6. Check questions for CGL exam
SELECT 
  id,
  exam_id,
  subject_id,
  chapter_id,
  question_text,
  difficulty,
  source_type,
  year,
  created_at
FROM public.questions
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1)
LIMIT 10;

-- 7. Count total questions for CGL
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT subject_id) as total_subjects,
  COUNT(DISTINCT chapter_id) as total_chapters
FROM public.questions
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1);

-- 8. Check battle logs for CGL (if any)
SELECT 
  COUNT(*) as total_battle_logs,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as total_sessions
FROM public.battle_logs bl
JOIN public.questions q ON bl.question_id = q.id
WHERE q.exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1);

-- 9. Summary of CGL data availability
SELECT 
  'Exams' as table_name,
  COUNT(*) as record_count
FROM public.exams
WHERE name ILIKE '%cgl%'
UNION ALL
SELECT 
  'Mock Tests' as table_name,
  COUNT(*) as record_count
FROM public.mock_tests
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1)
UNION ALL
SELECT 
  'Subjects' as table_name,
  COUNT(*) as record_count
FROM public.subjects
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1)
UNION ALL
SELECT 
  'Questions' as table_name,
  COUNT(*) as record_count
FROM public.questions
WHERE exam_id = (SELECT id FROM public.exams WHERE name ILIKE '%cgl%' LIMIT 1); 