import { supabase } from './supabaseClient';

interface SessionData {
  started_at: string;
  ended_at: string;
  correct_count: number;
  incorrect_count: number;
  total_xp_earned: number;
  streak_count: number;
  level: number;
}

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

const getPreviousSessionData = async (userId: string) => {
  const { data, error } = await supabase
    .from('review_sessions')
    .select('ended_at, streak_count, total_xp_earned, level')
    .eq('user_id', userId)
    .order('ended_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching previous session:', error);
    return null;
  }

  return data;
};

const calculateDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Function to reset all XP and streak values to zero
export const resetAllUserData = async () => {
  try {
    const { data, error } = await supabase
      .from('review_sessions')
      .update({
        total_xp_earned: 0,
        streak_count: 0,
        level: 1
      })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

    if (error) {
      throw new Error(`Error resetting user data: ${error.message}`);
    }

    console.log('Successfully reset all user XP and streak data');
    return { success: true, updatedRows: data?.length || 0 };
  } catch (error) {
    console.error('Failed to reset user data:', error);
    throw error;
  }
};

// Function to reset data for a specific user
export const resetUserData = async (userId?: string) => {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      throw new Error('No user ID provided and no authenticated user found');
    }

    const { data, error } = await supabase
      .from('review_sessions')
      .update({
        total_xp_earned: 0,
        streak_count: 0,
        level: 1
      })
      .eq('user_id', targetUserId);

    if (error) {
      throw new Error(`Error resetting user data: ${error.message}`);
    }

    console.log(`Successfully reset XP and streak data for user: ${targetUserId}`);
    return { success: true, updatedRows: data?.length || 0 };
  } catch (error) {
    console.error('Failed to reset user data:', error);
    throw error;
  }
};

// Function to delete all review sessions (nuclear option)
export const deleteAllReviewSessions = async () => {
  try {
    const { data, error } = await supabase
      .from('review_sessions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      throw new Error(`Error deleting review sessions: ${error.message}`);
    }

    console.log('Successfully deleted all review sessions');
    return { success: true, deletedRows: data?.length || 0 };
  } catch (error) {
    console.error('Failed to delete review sessions:', error);
    throw error;
  }
};

// Utility function to get user's current stats
export const getUserStats = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('review_sessions')
    .select('total_xp_earned, streak_count, level, ended_at')
    .eq('user_id', user.id)
    .order('ended_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching user stats: ${error.message}`);
  }

  return data || { total_xp_earned: 0, streak_count: 0, level: 1, ended_at: null };
};

// Function to simulate XP/streak calculation for testing
export const simulateSessionCalculation = async (sessionStartTime: string) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const previousSession = await getPreviousSessionData(user.id);
  
  let newStreak = 1;
  let newXp = 40; // Base XP for completing a session
  let newLevel = 1;

  if (previousSession) {
    const daysSinceLastSession = calculateDaysDifference(previousSession.ended_at, sessionStartTime);
    
    if (daysSinceLastSession === 1) {
      // User practiced yesterday - increase streak
      newStreak = previousSession.streak_count + 1;
      newXp = previousSession.total_xp_earned + 40;
    } else if (daysSinceLastSession > 1) {
      // User skipped days - calculate penalty
      const missedDays = daysSinceLastSession - 1;
      const penalty = missedDays * 10;
      newStreak = 1; // Reset streak
      newXp = Math.max(0, previousSession.total_xp_earned - penalty + 40); // Never go below 0
    } else {
      // Same day or future date (shouldn't happen in normal flow)
      newStreak = previousSession.streak_count;
      newXp = previousSession.total_xp_earned + 40;
    }
  }

  // Calculate new level based on XP
  newLevel = calculateLevel(newXp);

  return {
    currentXp: previousSession?.total_xp_earned || 0,
    currentStreak: previousSession?.streak_count || 0,
    currentLevel: previousSession?.level || 1,
    newXp,
    newStreak,
    newLevel,
    daysSinceLastSession: previousSession ? calculateDaysDifference(previousSession.ended_at, sessionStartTime) : 0,
  };
};

const saveReviewSession = async ({
  started_at,
  ended_at,
  correct_count,
  incorrect_count,
  total_xp_earned,
  streak_count,
  level,
}: SessionData) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const userId = user.id;
  const total_cards = correct_count + incorrect_count;
  const accuracy = total_cards > 0
    ? Number(((correct_count / total_cards) * 100).toFixed(2))
    : 0;

  // Get previous session data
  const previousSession = await getPreviousSessionData(userId);
  
  let newStreak = 1;
  let newXp = 40; // Base XP for completing a session
  let newLevel = 1;

  if (previousSession) {
    const daysSinceLastSession = calculateDaysDifference(previousSession.ended_at, started_at);
    
    if (daysSinceLastSession === 1) {
      // User practiced yesterday - increase streak
      newStreak = previousSession.streak_count + 1;
      newXp = previousSession.total_xp_earned + 40;
    } else if (daysSinceLastSession > 1) {
      // User skipped days - calculate penalty
      const missedDays = daysSinceLastSession - 1;
      const penalty = missedDays * 10;
      newStreak = 1; // Reset streak
      newXp = Math.max(0, previousSession.total_xp_earned - penalty + 40); // Never go below 0
    } else {
      // Same day or future date (shouldn't happen in normal flow)
      newStreak = previousSession.streak_count;
      newXp = previousSession.total_xp_earned + 40;
    }
  }

  // Calculate new level based on XP
  newLevel = calculateLevel(newXp);

  // Insert the new session with calculated values
  const { data, error } = await supabase.from('review_sessions').insert([
    {
      user_id: userId,
      started_at,
      ended_at,
      correct_count,
      incorrect_count,
      accuracy,
      total_xp_earned: newXp,
      streak_count: newStreak,
      level: newLevel,
      cards_reviewed: total_cards,
    },
  ]);

  if (error) {
    throw new Error(`Error saving review session: ${error.message}`);
  }

  return {
    ...data?.[0],
    calculatedXp: newXp,
    calculatedStreak: newStreak,
    calculatedLevel: newLevel,
  };
};

export default saveReviewSession;
