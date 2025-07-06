# 🍅 Pomodoro Study Session System

A production-ready React frontend implementation for tracking Pomodoro study sessions with Supabase integration.

## ✨ Features

### 🎯 Core Functionality
- **25-minute Pomodoro sessions** with automatic tracking
- **Database persistence** - sessions survive page reloads and navigation
- **Real-time progress tracking** with elapsed time display
- **Session statistics** - daily and total study time
- **Multiple session types** - focus, topic completion, test sessions

### 🔄 Session Management
- **Database-first approach** - sessions stored in Supabase
- **Automatic session resume** on page reload
- **No navigation blocking** - users can safely navigate away
- **Session reset functionality** for interrupted sessions
- **Proper session ending** with duration calculation

### 📊 Progress Tracking
- **Subject-level progress** tracking
- **Subtopic completion** tracking
- **Daily study statistics** 
- **Historical session data**
- **Real-time stats updates**

## 🗄️ Database Schema

### `user_daily_study_sessions` Table
```sql
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
```

### `user_subject_stats` Table
```sql
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
```

## 🛠️ Implementation

### Core Hook: `usePomodoroTimer` (Enhanced)

```tsx
const {
  session,
  timerState,
  isLoading,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  resetSession,
  formatTime,
  formatProgress
} = usePomodoroTimer(subjectId, subjectName);
```

### Session Types
- **`focus`** - Standard Pomodoro study session (25 minutes)
- **`short_break`** - Short break session (5 minutes)
- **`long_break`** - Long break session (15 minutes)

### Key Features

#### ✅ Timer Persistence with Pause State
```tsx
// Timer state is persisted in database with pause functionality
// Users can pause, navigate away, and resume later
```

**Features:**
- Timer state saved in Supabase database
- Pause/resume functionality with state memory
- Automatic timer resume on page reload
- Cross-tab synchronization
- Navigation warnings only for active (non-paused) sessions

#### 🔄 Database-First Session Management
```tsx
// Session state is managed from database, not just localStorage
const activeSession = await supabase
  .from('user_daily_study_sessions')
  .select('*')
  .eq('user_id', user.id)
  .is('ended_at', null)
  .single();
```

#### ⏱️ Accurate Timer State Management
```tsx
// Timer state calculated from database with pause support
const remainingSeconds = session.isPaused 
  ? session.remainingSeconds 
  : Math.max(0, POMODORO_DURATION - elapsed);
```

#### 📈 Real-Time Statistics
```tsx
// Stats updated after every session action
const stats = await supabase
  .from('user_daily_study_sessions')
  .select('duration_minutes')
  .eq('user_id', user.id)
  .gte('started_at', startOfDay);
```

## 🧪 Testing

### Test Pages: 
- `/pomodoro-test` - Basic session management testing
- `/enhanced-pomodoro-test` - Enhanced timer with persistence testing

Comprehensive testing interface with:
- Session start/end/reset controls
- Subject selection
- Session persistence testing
- Page reload testing
- Statistics verification
- Debug logging

### Test Instructions
1. **Start a session** - Click "Start Session" to begin a 25-minute timer
2. **Test pause/resume** - Pause the timer, navigate away, then return and resume
3. **Test page reload** - Reload the page to verify timer resumes correctly
4. **Test tab switching** - Open multiple tabs and switch between them
5. **Test session types** - Try different session types (Focus, Topic, Test)
6. **Test session end** - End session and verify cleanup

## 🔧 Setup

### 1. Database Tables
Run the SQL scripts to create tables and RLS policies:

```sql
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
```

-- Create user_subtopic_progress table
CREATE TABLE user_subtopic_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL,
  subtopic_id INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  time_spent_minutes INTEGER DEFAULT 0,
  last_studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. RLS Policies
```sql
-- Enable RLS
ALTER TABLE user_daily_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subtopic_progress ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can view own study sessions" ON user_daily_study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON user_daily_study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions" ON user_daily_study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions" ON user_daily_study_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Supabase Client
Ensure your Supabase client is configured:

```tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 🎯 Usage Examples

### Basic Pomodoro Timer
```tsx
import PomodoroTimer from './components/PomodoroTimer';

<PomodoroTimer
  subjectId={1}
  subjectName="Indian Polity"
  onSessionEnd={() => console.log('Session ended')}
/>
```

### Custom Session Management
```tsx
import { usePomodoroSession } from './hooks/usePomodoroSession';

const { startSession, endSession, activeSession } = usePomodoroSession();

// Start a focus session
await startSession(1, "Indian Polity", "focus");

// End the session
await endSession();
```

### Progress Tracking
```tsx
const { sessionStats, fetchSessionStats } = usePomodoroSession();

// Fetch stats for a subject
await fetchSessionStats(1);

// Display stats
console.log(`Today: ${sessionStats.totalTimeToday} minutes`);
console.log(`Total: ${sessionStats.totalTimeAll} minutes`);
```

## 🚀 Key Benefits

1. **Production Ready** - Comprehensive error handling and edge cases
2. **User Friendly** - No intrusive navigation warnings
3. **Data Persistent** - Sessions survive page reloads and crashes
4. **Real-time Updates** - Statistics update immediately
5. **Type Safe** - Full TypeScript support
6. **Scalable** - Database-first architecture
7. **Testable** - Comprehensive testing interface

## 🔍 Debugging

### Console Logs
The system includes detailed console logging for debugging:
- Session start/end events
- Database operations
- Error handling
- State changes

### Test Components
- `PomodoroTest` - Comprehensive testing interface
- `DebugSession` - Session state debugging
- `DebugProgress` - Progress tracking debugging

### Common Issues
1. **400 Error with duration_minutes** - Ensure `duration_minutes` is a generated column
2. **RLS Policy Errors** - Verify RLS policies are correctly configured
3. **Session Not Resuming** - Check localStorage and database for session data
4. **Stats Not Updating** - Verify `fetchSessionStats` is called after session changes

## 📝 Notes

- Sessions are automatically cleaned up after 25 minutes
- Progress is tracked at both subject and subtopic levels
- All timestamps are stored in UTC
- Duration is calculated automatically by the database
- No manual `duration_minutes` insertion (it's a generated column) 