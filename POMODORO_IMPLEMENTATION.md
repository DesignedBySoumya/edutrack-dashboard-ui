# Pomodoro Session Tracking Implementation

This implementation provides a complete Pomodoro-style study session tracking system that integrates with your existing Supabase tables.

## Database Schema

The implementation works with your existing Supabase tables:

### `public.user_daily_study_sessions`
- `id` (UUID) - Primary key
- `user_id` (UUID) - References `auth.users.id`
- `subtopic_id` (INTEGER) - References `public.subtopics.id`
- `started_at` (TIMESTAMP) - Session start time
- `ended_at` (TIMESTAMP) - Session end time (nullable)
- `duration_minutes` (INTEGER) - Computed column
- `session_type` (TEXT) - Either 'focus' or 'break'

### `public.user_subtopic_progress`
- `user_id` (UUID) - References `auth.users.id`
- `subtopic_id` (INTEGER) - References `public.subtopics.id`
- `is_completed` (BOOLEAN) - Completion status
- `time_spent_minutes` (INTEGER) - Total time spent
- `last_studied_at` (TIMESTAMP) - Last study session

## Files Created

1. **`src/hooks/usePomodoro.ts`** - Main hook for session management
2. **`src/types/pomodoro.ts`** - TypeScript type definitions
3. **`src/components/PomodoroExample.tsx`** - Example usage component

## Usage

### Basic Hook Usage

```tsx
import { usePomodoro } from '@/hooks/usePomodoro';
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  const subtopicId = 123; // Your subtopic ID
  
  const { 
    sessionId, 
    isLoading, 
    error, 
    startSession, 
    endSession, 
    getProgress 
  } = usePomodoro(user?.id || '', subtopicId);

  const handleStart = async () => {
    try {
      await startSession('focus'); // or 'break'
      console.log('Session started');
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleEnd = async (isCompleted = false) => {
    try {
      const result = await endSession(isCompleted);
      console.log('Session ended:', result);
      // result contains: { sessionId, addedMinutes, totalMinutes, isCompleted }
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  return (
    <div>
      <button onClick={handleStart} disabled={isLoading}>
        Start Session
      </button>
      <button onClick={() => handleEnd(false)} disabled={!sessionId}>
        End Session
      </button>
      <button onClick={() => handleEnd(true)} disabled={!sessionId}>
        End & Mark Complete
      </button>
    </div>
  );
}
```

### Integration with Existing Components

You can integrate this into your existing `StudySession` component:

```tsx
// In your StudySession component
import { usePomodoro } from '@/hooks/usePomodoro';

export const StudySession = ({ subject, onBack }: StudySessionProps) => {
  const { user } = useAuth();
  const { startSession, endSession } = usePomodoro(user?.id || '', subject.id);
  
  const handlePlayPause = async () => {
    if (!isActive) {
      // Start new session
      await startSession('focus');
      setIsActive(true);
    } else {
      // End current session
      await endSession(false);
      setIsActive(false);
    }
  };

  // ... rest of your component
};
```

## Hook API

### `usePomodoro(userId: string, subtopicId: number)`

Returns an object with:

- **`sessionId`** - Current active session ID (null if no active session)
- **`isLoading`** - Loading state for async operations
- **`error`** - Error message if any operation fails
- **`startSession(sessionType?)`** - Start a new session (default: 'focus')
- **`endSession(isCompleted?)`** - End current session (default: false)
- **`getCurrentSession()`** - Get current session data
- **`getProgress()`** - Get user progress for this subtopic

### Session Types

- `'focus'` - Regular study session
- `'break'` - Break session

### Completion Handling

- `endSession(false)` - End session without marking as completed
- `endSession(true)` - End session and mark subtopic as completed

## Error Handling

The hook includes comprehensive error handling:

- Network errors are caught and logged
- Database constraint violations are handled
- User-friendly error messages are provided
- Loading states prevent multiple simultaneous operations

## Type Safety

Full TypeScript support with proper interfaces:

```tsx
import type { 
  PomodoroSession, 
  UserSubtopicProgress, 
  SessionResult 
} from '@/types/pomodoro';
```

## Integration Notes

1. **No Schema Changes Required** - Works with your existing tables
2. **RLS Compatible** - Respects your existing Row Level Security
3. **Supabase v2** - Uses the latest Supabase JavaScript client
4. **React 18+** - Compatible with modern React patterns
5. **TypeScript** - Full type safety throughout

## Example Component

See `src/components/PomodoroExample.tsx` for a complete working example that demonstrates:

- Starting/ending sessions
- Progress tracking
- Completion status
- Error handling
- Loading states
- Toast notifications

## Testing

To test the implementation:

1. Ensure your Supabase tables exist with the correct schema
2. Verify RLS policies allow the operations
3. Use the `PomodoroExample` component to test functionality
4. Check the browser console for any errors
5. Verify data is being written to both tables correctly 