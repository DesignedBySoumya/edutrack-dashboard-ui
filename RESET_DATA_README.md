# Reset XP & Streak Data

## Quick Reset Guide

Since we're now fetching XP and streak data from Supabase instead of using local state, you may need to reset existing data to start fresh.

## Option 1: Use the XPStreakTester Component

1. Navigate to the XPStreakTester component in your app
2. Click "Reset My Data" to reset your current user's data
3. Click "Reset All Users" to reset all users' data
4. Click "Delete All Sessions" to completely remove all session data

## Option 2: Use Console Commands

1. Import the reset utility in your app:
```typescript
import '@/utils/resetData';
```

2. Open browser console and run:
```javascript
// Reset all data (recommended)
await resetEverything()

// Or reset specific data:
await resetCurrentUserData() // Current user only
await resetAllUsersData()    // All users
await deleteAllSessionsData() // Delete all sessions
```

## Option 3: Direct Function Calls

```typescript
import { resetAllUserData, resetUserData, deleteAllReviewSessions } from '@/lib/reviewSessions';

// Reset all users' XP and streak to zero
const result = await resetAllUserData();
console.log('Reset result:', result);

// Reset current user only
const userResult = await resetUserData();
console.log('User reset result:', userResult);

// Delete all review sessions (nuclear option)
const deleteResult = await deleteAllReviewSessions();
console.log('Delete result:', deleteResult);
```

## What Gets Reset

- `total_xp_earned`: Set to 0
- `streak_count`: Set to 0  
- `level`: Set to 1

## What Doesn't Get Reset

- Session history (unless using delete function)
- User accounts
- Flashcard data
- Other user data

## Recommended Approach

1. **For Development**: Use `resetAllUserData()` to reset XP/streak while keeping session history
2. **For Production**: Use `resetEverything()` to start completely fresh
3. **For Testing**: Use the XPStreakTester component for interactive testing

## Safety Features

- All reset functions have confirmation dialogs
- Console functions are clearly labeled
- Error handling prevents data corruption
- Logging shows exactly what was reset

## After Reset

Once you've reset the data:
1. The new XP/streak system will start from zero
2. All future sessions will use the new calculation logic
3. Users will start at Level 1 with 0 XP
4. Streaks will begin fresh from the next session 