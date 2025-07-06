import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { 
  PomodoroSession, 
  UserSubtopicProgress, 
  SessionResult, 
  PomodoroHookReturn 
} from '@/types/pomodoro';

export function usePomodoroDebug(userId: string, subtopicId: number): PomodoroHookReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = async (sessionType: 'focus' | 'break' = 'focus') => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 DEBUG: Starting session with params:', {
        userId,
        subtopicId,
        sessionType,
        timestamp: new Date().toISOString()
      });

      const sessionData = {
        user_id: userId,
        subtopic_id: subtopicId,
        started_at: new Date().toISOString(),
        session_type: sessionType,
      };

      console.log('🔍 DEBUG: Session data to insert:', sessionData);

      const { data, error: insertError } = await supabase
        .from('user_daily_study_sessions')
        .insert([sessionData])
        .select('id')
        .single();

      if (insertError) {
        console.error('❌ DEBUG: Error starting session:', insertError);
        setError(insertError.message);
        throw insertError;
      }

      console.log('✅ DEBUG: Session started successfully:', data);
      setSessionId(data.id);
      return data.id;
    } catch (err) {
      console.error('❌ DEBUG: Failed to start session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async (isCompleted: boolean = false) => {
    if (!sessionId) {
      const errorMsg = 'No active session to end.';
      console.error('❌ DEBUG:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setIsLoading(true);
      setError(null);

      const endedAt = new Date().toISOString();

      console.log('🔍 DEBUG: Ending session with params:', {
        sessionId,
        isCompleted,
        endedAt,
        userId,
        subtopicId
      });

      // 1. Update the session end time
      console.log('🔍 DEBUG: Step 1 - Updating session end time...');
      const { data: session, error: endError } = await supabase
        .from('user_daily_study_sessions')
        .update({ ended_at: endedAt })
        .eq('id', sessionId)
        .select('duration_minutes')
        .single();

      if (endError) {
        console.error('❌ DEBUG: Error ending session:', endError);
        setError(endError.message);
        throw endError;
      }

      console.log('✅ DEBUG: Session updated successfully:', session);
      const addedMinutes = session.duration_minutes ?? 0;
      console.log('🔍 DEBUG: Added minutes from session:', addedMinutes);

      // 2. Get existing progress
      console.log('🔍 DEBUG: Step 2 - Fetching existing progress...');
      const { data: existing, error: fetchError } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subtopic_id', subtopicId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ DEBUG: Error fetching existing progress:', fetchError);
        setError(fetchError.message);
        throw fetchError;
      }

      console.log('✅ DEBUG: Existing progress fetched:', existing);

      // 3. Prepare progress data
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

      console.log('🔍 DEBUG: Step 3 - Upserting progress data:', progressData);

      // 4. Upsert progress data
      const { data: upsertData, error: upsertError } = await supabase
        .from('user_subtopic_progress')
        .upsert([progressData], {
          onConflict: 'user_id,subtopic_id'
        })
        .select();

      if (upsertError) {
        console.error('❌ DEBUG: Error upserting progress:', upsertError);
        setError(upsertError.message);
        throw upsertError;
      }

      console.log('✅ DEBUG: Progress upserted successfully:', upsertData);

      // Clear session ID after successful completion
      setSessionId(null);
      
      const result = {
        sessionId,
        addedMinutes,
        totalMinutes: progressData.time_spent_minutes,
        isCompleted: progressData.is_completed
      };

      console.log('✅ DEBUG: Session ended successfully with result:', result);
      
      return result;
    } catch (err) {
      console.error('❌ DEBUG: Failed to end session:', err);
      setError(err instanceof Error ? err.message : 'Failed to end session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSession = async () => {
    if (!sessionId) return null;

    try {
      console.log('🔍 DEBUG: Fetching current session:', sessionId);
      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('❌ DEBUG: Error fetching current session:', error);
        return null;
      }

      console.log('✅ DEBUG: Current session fetched:', data);
      return data;
    } catch (err) {
      console.error('❌ DEBUG: Failed to fetch current session:', err);
      return null;
    }
  };

  const getProgress = async () => {
    try {
      console.log('🔍 DEBUG: Fetching progress for user:', userId, 'subtopic:', subtopicId);
      const { data, error } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subtopic_id', subtopicId)
        .maybeSingle();

      if (error) {
        console.error('❌ DEBUG: Error fetching progress:', error);
        return null;
      }

      console.log('✅ DEBUG: Progress fetched:', data);
      return data;
    } catch (err) {
      console.error('❌ DEBUG: Failed to fetch progress:', err);
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