# Study Session Data Fix Guide

This guide will help you fix the issues with study session data not being saved to Supabase and remove hardcoded data.

## Issues Fixed

1. **Study session data not saving to Supabase**
2. **Hardcoded timeSpent values** instead of real data
3. **Missing table structure** and RLS policies
4. **Poor error handling** and debugging
5. **❌ CRITICAL FIX: Don't send duration_minutes in insert** - Duration is now auto-calculated by database
6. **🔄 Reload resets timer & session state** - localStorage persistence implemented
7. **🚫 Back button loses progress** - Navigation blocking added
8. **🔄 Reset button doesn't end session** - Proper session cleanup
9. **📊 Total Time / Spent Today Not Updating** - Real-time stats calculation

## Step 1: Fix Database Table Structure

Run the SQL script `fix_study_sessions.sql` in your Supabase SQL Editor:

```sql
-- This will recreate the user_daily_study_sessions table with correct structure
-- and proper RLS policies
```

**What this does:**
- Drops and recreates the table with correct columns
- Adds proper foreign key constraints
- Sets up RLS policies for SELECT, INSERT, UPDATE, DELETE
- Creates indexes for better performance

## Step 2: Test the Complete Solution

1. **Navigate to the Pomodoro test page:**
   ```
   http://localhost:5173/pomodoro-test
   ```

2. **Test all features:**
   - Start a Pomodoro session
   - Test navigation blocking (try to close/refresh tab)
   - Test page reload (session should resume)
   - End session and verify stats update
   - Check browser console for detailed logs

3. **Or use the basic debug panel:**
   ```
   http://localhost:5173/study-session-test
   ```

3. **Check browser console** for detailed logs with emojis:
   - ✅ Success messages
   - ❌ Error messages
   - 🔍 Debug information
   - 🔄 Refetch operations

## Step 3: Test Real Study Sessions

1. **Go to the main page** (`http://localhost:5173/`)
2. **Start a study session** by clicking the play button on any subject
3. **Check the console** for session logging messages
4. **End the session** and verify the duration is saved
5. **Refresh the page** and verify the timeSpent is calculated from real data

## Step 4: Verify Data Flow

### Before Fix:
- ❌ `timeSpent: "0h 00m"` (hardcoded)
- ❌ No study sessions in database
- ❌ Poor error handling

### After Fix:
- ✅ `timeSpent: "2h 15m"` (calculated from real sessions)
- ✅ Study sessions saved to `user_daily_study_sessions`
- ✅ Detailed error logging and debugging

## Key Changes Made

### 1. Database Structure
```sql
CREATE TABLE public.user_daily_study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE,
  subtopic_id INTEGER REFERENCES public.subtopics(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN ended_at IS NOT NULL THEN 
        EXTRACT(EPOCH FROM (ended_at - started_at)) / 60
      ELSE 0
    END
  ) STORED,
  session_type TEXT DEFAULT 'focus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Improvement:** `duration_minutes` is now a generated column that automatically calculates the duration when `ended_at` is set. This prevents manual duration errors and ensures accuracy.

### 2. Real-time Data Calculation
```typescript
// Calculate actual time spent from study sessions
const subjectSessions = userStudySessions.filter(session => session.subject_id === subject.id);
const totalMinutes = subjectSessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes % 60;
const timeSpent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
```

### 3. Enhanced Error Handling
```typescript
if (sessionError) {
  console.error('❌ Error logging study session:', sessionError);
  console.error('❌ Error details:', {
    message: sessionError.message,
    details: sessionError.details,
    hint: sessionError.hint,
    code: sessionError.code
  });
} else {
  console.log('✅ Study session logged successfully:', insertedSession);
  // Refetch to update UI
  fetchSubjects();
}
```

### 4. Database-First Session Management
```typescript
// Session Start - Store in database immediately
const sessionData = {
  user_id: user.id,
  subject_id: subjectId,
  subtopic_id: null,
  started_at: new Date().toISOString(),
  session_type: 'focus'
  // ⛔ DO NOT send duration_minutes - it will be calculated when session ends
};

// Session Resume - Load from database on page reload
const { data: activeSessions } = await supabase
  .from('user_daily_study_sessions')
  .select('*')
  .eq('user_id', user.id)
  .is('ended_at', null)
  .order('started_at', { ascending: false })
  .limit(1);

// Session End - Only set ended_at, duration is auto-calculated
const { error: updateError } = await supabase
  .from('user_daily_study_sessions')
  .update({
    ended_at: sessionEndTime
  })
  .eq('id', activeSession.sessionId)
  .is('ended_at', null);
```

## Troubleshooting

### If "Check Table" fails:
1. Run the SQL script in Supabase
2. Check if the table exists in Supabase dashboard
3. Verify RLS is enabled

### If "Test Insert" fails:
1. Check RLS policies in Supabase
2. Verify user authentication
3. Check foreign key constraints

### If sessions don't appear:
1. Check browser console for errors
2. Verify the user_id matches
3. Check if sessions are being created with correct data

### If timeSpent doesn't update:
1. Check if `fetchSubjects()` is being called after session creation
2. Verify the calculation logic
3. Check if sessions have correct `subject_id` values

## Debug Components

### StudySessionDebug Component
- Comprehensive testing interface
- Real-time session management
- Detailed error reporting
- User authentication verification

### Enhanced Logging
- Emoji-based status indicators
- Detailed error information
- Step-by-step operation tracking
- Data validation checks

## Expected Behavior

1. **Session Start:**
   ```
   🔍 Starting session with data: {...}
   ✅ Session started successfully and stored in database: {...}
   🎯 Study Session Started
   ```

2. **Page Reload (Session Resume):**
   ```
   ✅ Resumed session from database: {...}
   🎯 Session Resumed from Database
   ```

3. **Session End:**
   ```
   🔍 Ending session at: 2024-01-15T10:30:00.000Z
   ✅ Session ended successfully and stored in database
   ✅ Study Session Ended
   ```

4. **Data Display:**
   - Time spent shows actual calculated values from database
   - Progress percentages update correctly
   - Sessions appear in debug panel
   - Accurate elapsed time from database timestamps

## Files Modified

1. `src/pages/Index.tsx` - Main logic and data fetching
2. `src/components/StudySessionDebug.tsx` - Debug component
3. `src/pages/StudySessionTest.tsx` - Basic test page
4. `src/pages/PomodoroTest.tsx` - Complete Pomodoro test page
5. `src/components/PomodoroTimer.tsx` - Pomodoro timer component
6. `src/hooks/usePomodoroSession.ts` - Session management hook
7. `src/App.tsx` - Added test routes
8. `fix_study_sessions.sql` - Database fix script

## Next Steps

1. Run the SQL script in Supabase
2. Test the complete Pomodoro system at `/pomodoro-test`
3. Verify all features work:
   - Session persistence across reloads
   - Navigation blocking
   - Real-time stats updates
   - Proper session ending
4. Monitor console logs for any remaining issues
5. Integrate the `usePomodoroSession` hook into your main app
6. Remove debug components when everything works

## Key Features Implemented

### 🍅 Complete Pomodoro System
- 25-minute work sessions with 5-minute breaks
- Automatic phase progression
- Session pause/resume functionality
- Visual progress indicators

### 💾 Database-First Session Persistence
- Sessions stored in database with actual start times
- Automatic session resume from database on page reload
- localStorage as backup for quick access
- Stale session cleanup (4-hour limit)
- Accurate elapsed time calculation from database timestamps

### 🚫 Navigation Protection
- Browser tab close warnings
- Page refresh protection
- Confirmation dialogs for session changes

### 📊 Real-time Statistics
- Today's study time
- Total study time
- Session completion tracking
- Automatic stats refresh

### 🔧 Robust Error Handling
- Comprehensive error logging
- Graceful fallbacks
- User-friendly error messages
- Detailed debugging information

## Support

If you encounter issues:
1. Check browser console for detailed error messages
2. Use the debug panel to isolate problems
3. Verify database table structure in Supabase
4. Check RLS policies and user authentication 