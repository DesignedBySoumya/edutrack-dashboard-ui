# XP & Streak Logic Implementation

## Overview

This document explains the XP and streak system implemented for the flashcard review sessions in the Supabase project.

## Core Logic

### 1. Base XP System
- **Daily Session Bonus**: +40 XP for completing a flashcard session each day
- **XP Range**: 0 to unlimited (never goes below 0)
- **Level Calculation**: `Level = Math.floor(XP / 100) + 1`

### 2. Streak System
- **Consecutive Days**: Streak increases by +1 if user practiced yesterday
- **Missed Days**: Streak resets to 1 if any day was skipped
- **Same Day**: Streak remains unchanged if multiple sessions on same day

### 3. Penalty System
- **Missed Day Penalty**: -10 XP per missed day
- **Example**: If user skips 3 days, they lose 30 XP (3 × 10)
- **Minimum XP**: Never goes below 0 XP

## Database Schema

The `review_sessions` table contains:
```sql
- id (primary key)
- user_id (foreign key)
- started_at (timestamp)
- ended_at (timestamp)
- correct_count (integer)
- incorrect_count (integer)
- accuracy (decimal)
- total_xp_earned (integer) - Cumulative XP
- streak_count (integer) - Current streak
- level (integer) - Current level
- cards_reviewed (integer)
- created_at (timestamp)
```

## Implementation Details

### Main Function: `saveReviewSession`

Located in `src/lib/reviewSessions.ts`, this function:

1. **Fetches Previous Session**: Gets the user's most recent session
2. **Calculates Day Difference**: Determines days since last session
3. **Applies Logic**:
   - 1 day difference → Increase streak, add 40 XP
   - >1 day difference → Reset streak, apply penalty, add 40 XP
   - Same day → Keep current streak, add 40 XP
4. **Calculates Level**: Based on total XP
5. **Saves Session**: Inserts new record with calculated values

### Helper Functions

- `getPreviousSessionData()`: Fetches user's last session
- `calculateDaysDifference()`: Calculates days between two dates
- `calculateLevel()`: Converts XP to level
- `getUserStats()`: Gets current user stats
- `simulateSessionCalculation()`: Simulates session without saving

## Usage Examples

### Basic Session Save
```typescript
import saveReviewSession from '@/lib/reviewSessions';

const result = await saveReviewSession({
  started_at: '2024-01-15T10:00:00Z',
  ended_at: '2024-01-15T10:30:00Z',
  correct_count: 8,
  incorrect_count: 2,
  total_xp_earned: 0, // Will be calculated
  streak_count: 0,    // Will be calculated
  level: 1,           // Will be calculated
});

console.log('New XP:', result.calculatedXp);
console.log('New Streak:', result.calculatedStreak);
console.log('New Level:', result.calculatedLevel);
```

### Get Current Stats
```typescript
import { getUserStats } from '@/lib/reviewSessions';

const stats = await getUserStats();
console.log('Current XP:', stats.total_xp_earned);
console.log('Current Streak:', stats.streak_count);
console.log('Current Level:', stats.level);
```

### Simulate Session (for testing)
```typescript
import { simulateSessionCalculation } from '@/lib/reviewSessions';

const simulation = await simulateSessionCalculation(new Date().toISOString());
console.log('Would gain XP:', simulation.newXp - simulation.currentXp);
console.log('Would change streak:', simulation.newStreak - simulation.currentStreak);
```

## Testing

Use the `XPStreakTester` component to test the logic:

```typescript
import XPStreakTester from '@/components/XPStreakTester';

// Add to your page/component
<XPStreakTester />
```

This component provides:
- Current stats display
- Session simulation
- Before/after comparison
- Day difference calculation
- Reset functionality for testing

## Data Reset Functions

When switching from local state to Supabase, you may need to reset existing data:

### Reset Current User
```typescript
import { resetUserData } from '@/lib/reviewSessions';

const result = await resetUserData();
console.log('Reset result:', result);
```

### Reset All Users
```typescript
import { resetAllUserData } from '@/lib/reviewSessions';

const result = await resetAllUserData();
console.log('Reset result:', result);
```

### Delete All Sessions (Nuclear Option)
```typescript
import { deleteAllReviewSessions } from '@/lib/reviewSessions';

const result = await deleteAllReviewSessions();
console.log('Delete result:', result);
```

### Console Utility
Import the reset utility to access functions from browser console:

```typescript
import '@/utils/resetData';

// Then in browser console:
await resetEverything() // Reset all data
await resetCurrentUserData() // Reset current user only
await resetAllUsersData() // Reset all users
await deleteAllSessionsData() // Delete all sessions
```

## Level Progression

| Level | XP Range | XP Required |
|-------|----------|-------------|
| 1     | 0-99     | 0           |
| 2     | 100-199  | 100         |
| 3     | 200-299  | 200         |
| ...   | ...      | ...         |
| 20    | 1900-1999| 1900        |

## Edge Cases Handled

1. **First Session**: User gets 40 XP, streak = 1, level = 1
2. **Same Day Sessions**: Streak unchanged, XP accumulates
3. **Future Dates**: Handled gracefully (shouldn't occur in normal flow)
4. **Database Errors**: Proper error handling and logging
5. **No Previous Session**: Treated as first session
6. **XP Below 0**: Capped at 0 using `Math.max(0, xp)`

## Integration with Flashcard System

The system integrates with the existing flashcard store:

1. **Session Completion**: Triggered when all cards are reviewed
2. **Automatic Calculation**: XP/streak calculated server-side
3. **Real-time Updates**: Results returned to client
4. **Persistent Storage**: All data saved in Supabase

## Performance Considerations

- **Single Query**: Previous session fetched with one query
- **Indexed Fields**: `user_id` and `ended_at` should be indexed
- **Efficient Calculation**: All logic done in memory
- **Minimal Database Calls**: Only one insert per session

## Future Enhancements

Potential improvements:
- **Bonus XP**: Extra XP for high accuracy
- **Streak Milestones**: Bonus rewards for streak milestones
- **Weekly Goals**: Weekly XP targets
- **Leaderboards**: Compare with other users
- **Achievements**: Unlock achievements based on performance 