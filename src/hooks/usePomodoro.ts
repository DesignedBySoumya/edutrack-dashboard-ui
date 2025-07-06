import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { 
  PomodoroSession, 
  UserSubtopicProgress, 
  SessionResult, 
  PomodoroHookReturn 
} from '@/types/pomodoro';

export function usePomodoro(userId: string, subtopicId: number): PomodoroHookReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = async (sessionType: 'focus' | 'break' = 'focus') => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('user_daily_study_sessions')
        .insert([
          {
            user_id: userId,
            subtopic_id: subtopicId,
            started_at: new Date().toISOString(),
            session_type: sessionType,
          },
        ])
        .select('id')
        .single();

      if (insertError) {
        console.error('Error starting session:', insertError);
        setError(insertError.message);
        throw insertError;
      }

      setSessionId(data.id);
      return data.id;
    } catch (err) {
      console.error('Failed to start session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async (isCompleted: boolean = false) => {
    if (!sessionId) {
      const errorMsg = 'No active session to end.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setIsLoading(true);
      setError(null);

      const endedAt = new Date().toISOString();

      // 1. Update the session end time
      const { data: session, error: endError } = await supabase
        .from('user_daily_study_sessions')
        .update({ ended_at: endedAt })
        .eq('id', sessionId)
        .select('duration_minutes')
        .single();

      if (endError) {
        console.error('Error ending session:', endError);
        setError(endError.message);
        throw endError;
      }

      const addedMinutes = session.duration_minutes ?? 0;

      // 2. Get existing progress
      const { data: existing, error: fetchError } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subtopic_id', subtopicId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing progress:', fetchError);
        setError(fetchError.message);
        throw fetchError;
      }

      // 3. Upsert progress data
      const progressData: Partial<UserSubtopicProgress> = {
        user_id: userId,
        subtopic_id: subtopicId,
        time_spent_minutes: (existing?.time_spent_minutes ?? 0) + addedMinutes,
        last_studied_at: endedAt,
      };

      // Only update is_completed if explicitly marked as completed
      if (isCompleted) {
        progressData.is_completed = true;
      } else if (existing) {
        // Preserve existing completion status if not explicitly marking as completed
        progressData.is_completed = existing.is_completed;
      }

      const { error: upsertError } = await supabase
        .from('user_subtopic_progress')
        .upsert([progressData], {
          onConflict: 'user_id,subtopic_id'
        });

      if (upsertError) {
        console.error('Error upserting progress:', upsertError);
        setError(upsertError.message);
        throw upsertError;
      }

      // Clear session ID after successful completion
      setSessionId(null);
      
      return {
        sessionId,
        addedMinutes,
        totalMinutes: progressData.time_spent_minutes,
        isCompleted: progressData.is_completed
      };
    } catch (err) {
      console.error('Failed to end session:', err);
      setError(err instanceof Error ? err.message : 'Failed to end session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSession = async () => {
    if (!sessionId) return null;

    try {
      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching current session:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Failed to fetch current session:', err);
      return null;
    }
  };

  const getProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subtopic_id', subtopicId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching progress:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Failed to fetch progress:', err);
      return null;
    }
  };

  return {
    sessionId,
    isLoading,
    error,
    startSession,
    endSession,
    getCurrentSession,
    getProgress,
  };
} 