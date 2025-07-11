# Automatic Mock Test Creation (Session-Based)

## Overview

The PTS Report Card page (`/battlefield/war/report/pts`) now automatically creates a new mock test entry in the `mock_tests` table **only once per session**, preventing duplicate insertions on re-renders or hot reloads.

## Implementation Details

### Key Changes Made

1. **Session-based creation**: Uses `useRef` to track if a mock test has been created in the current session, preventing duplicate database insertions.

2. **Persistent state management**: Stores the `mock_id` in localStorage for persistence across page reloads within the same session.

3. **War route detection**: Detects when users navigate from `/battlefield/war` and ensures a fresh mock test is created for each new battle session.

4. **Duplicate prevention**: Multiple checks prevent creating duplicate mock tests:
   - Session flag tracking
   - Existing mock_id verification
   - localStorage persistence

5. **Clean session management**: Resets session flags on component unmount and when starting new war sessions.

### How It Works

1. **Session Tracking**: 
   - `mockCreatedInSession.current` tracks if a mock has been created in the current session
   - Prevents duplicate creation on re-renders or hot reloads

2. **Persistent Storage**:
   - `mock_id` is stored in localStorage for persistence
   - Verified against database on page load to ensure it still exists

3. **War Route Detection**:
   - `BeginBattle` component sets `from_war_route` flag when timer ends
   - PTS Report Card clears existing mock data when this flag is detected
   - Ensures fresh mock test for each new battle session

4. **Creation Logic**:
   ```typescript
   // Only create if not already created in this session
   if (mockId && mockCreatedInSession.current) {
     return mockId; // Return existing mock_id
   }
   
   // Check localStorage for existing mock_id
   const savedMockId = localStorage.getItem('mock_id');
   if (savedMockId && !mockCreatedInSession.current) {
     // Verify it exists in database and use it
   }
   
   // Create new mock test only if needed
   ```

### Database Schema

The mock test creation uses the following fields:

```sql
INSERT INTO mock_tests (
  user_id,
  exam_id, 
  pts_year,
  test_date,
  total_score,
  accuracy,
  rank,
  percentile
) VALUES (
  'user-uuid',
  1,
  '2025-2026',
  '2025-01-27T10:30:00Z',
  0,
  0,
  1200,
  0
);
```

### User Flow

1. User completes a war battle session
2. Timer ends → sets `from_war_route` flag → navigates to `/battlefield/war/report/pts`
3. Page loads → detects war route flag → clears existing mock data
4. Creates new mock test entry (only once per session)
5. User enters performance data → auto-saves using the single `mock_id`

### Session Management

- **New Session**: Each navigation from war route creates a fresh session
- **Same Session**: Re-renders and hot reloads reuse the existing mock_id
- **Cleanup**: Session flags reset on component unmount
- **Persistence**: mock_id survives page reloads within the same session

### Benefits

- **Prevents database pollution**: Only one mock test per session
- **Handles hot reloads**: No duplicate insertions during development
- **Maintains data integrity**: Each battle session gets a unique mock test
- **Persistent across reloads**: mock_id survives page refreshes
- **Clean session management**: Proper cleanup and fresh starts

### Technical Notes

- Uses `useRef` for session tracking (survives re-renders)
- Uses `localStorage` for persistence across reloads
- Implements proper cleanup on component unmount
- Includes database verification for stored mock_ids
- Handles RLS policy fallbacks gracefully

## Files Modified

- `src/pages/battlefield/PTSReportCard.tsx`: 
  - Added session tracking with `useRef`
  - Updated `ensureMockTest` with duplicate prevention
  - Added war route detection and cleanup
  - Implemented proper session management

- `src/components/battlefield/war/BeginBattle.tsx`:
  - Added `from_war_route` flag setting on battle end

## Error Prevention

The implementation prevents several common issues:

1. **Duplicate insertions**: Session tracking prevents multiple database inserts
2. **Hot reload pollution**: Re-renders reuse existing mock_id
3. **Stale data**: Database verification ensures stored mock_ids are valid
4. **Session confusion**: Clear separation between different battle sessions 