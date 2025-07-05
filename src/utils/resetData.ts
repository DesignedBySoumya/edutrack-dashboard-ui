import { resetAllUserData, resetUserData, deleteAllReviewSessions } from '@/lib/reviewSessions';

/**
 * Utility functions to reset XP and streak data
 * Use these functions to reset data when switching from local state to Supabase
 */

// Reset current user's data only
export const resetCurrentUserData = async () => {
  try {
    console.log('Resetting current user data...');
    const result = await resetUserData();
    console.log('✅ Successfully reset current user data:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to reset current user data:', error);
    throw error;
  }
};

// Reset all users' data
export const resetAllUsersData = async () => {
  try {
    console.log('Resetting all users data...');
    const result = await resetAllUserData();
    console.log('✅ Successfully reset all users data:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to reset all users data:', error);
    throw error;
  }
};

// Delete all review sessions (nuclear option)
export const deleteAllSessionsData = async () => {
  try {
    console.log('Deleting all review sessions...');
    const result = await deleteAllReviewSessions();
    console.log('✅ Successfully deleted all review sessions:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to delete all review sessions:', error);
    throw error;
  }
};

// Convenience function to reset everything
export const resetEverything = async () => {
  try {
    console.log('🧹 Starting complete data reset...');
    
    // First reset all user data
    const resetResult = await resetAllUsersData();
    
    // Then optionally delete all sessions (uncomment if needed)
    // const deleteResult = await deleteAllSessionsData();
    
    console.log('🎉 Complete reset finished successfully!');
    console.log('Reset result:', resetResult);
    // console.log('Delete result:', deleteResult);
    
    return {
      reset: resetResult,
      // delete: deleteResult,
    };
  } catch (error) {
    console.error('💥 Complete reset failed:', error);
    throw error;
  }
};

// Function to run from browser console
export const runResetFromConsole = () => {
  console.log(`
🚀 XP & Streak Data Reset Utility

Available functions:
- resetCurrentUserData() - Reset current user's data
- resetAllUsersData() - Reset all users' data  
- deleteAllSessionsData() - Delete all review sessions
- resetEverything() - Reset all data (recommended)

Example usage:
await resetEverything()
  `);
  
  // Make functions available globally for console access
  (window as any).resetCurrentUserData = resetCurrentUserData;
  (window as any).resetAllUsersData = resetAllUsersData;
  (window as any).deleteAllSessionsData = deleteAllSessionsData;
  (window as any).resetEverything = resetEverything;
  
  console.log('✅ Functions are now available in the console!');
};

// Auto-run when imported
if (typeof window !== 'undefined') {
  runResetFromConsole();
} 