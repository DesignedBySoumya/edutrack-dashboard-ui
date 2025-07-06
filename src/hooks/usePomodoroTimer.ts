import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

interface PomodoroSession {
  id: string;
  subjectId: number;
  subjectName: string;
  sessionType: string;
  durationMinutes: number;
  startedAt: string;
  pausedAt?: string;
  endedAt?: string;
  isPaused: boolean;
  remainingSeconds: number;
  status: 'active' | 'completed' | 'canceled';
}

interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  elapsedSeconds: number;
}

interface SubjectStats {
  totalFocusSeconds: number;
  sessionsCompleted: number;
  lastSessionCompletedAt?: string;
}

export const usePomodoroTimer = (subjectId: number, subjectName: string, defaultDurationMinutes: number = 25) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const defaultDurationSeconds = defaultDurationMinutes * 60;
  
  const [session, setSession] = useState<PomodoroSession | null>(null);
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    isPaused: false,
    remainingSeconds: defaultDurationSeconds,
    elapsedSeconds: 0
  });
  
  const [subjectStats, setSubjectStats] = useState<SubjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Load active session on mount
  useEffect(() => {
    if (user) {
      loadActiveSession();
      loadSubjectStats();
    }
  }, [user, subjectId]);

  // Timer tick effect
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused && session) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastTickRef.current) / 1000);
        lastTickRef.current = now;

        setTimerState(prev => {
          const newRemaining = Math.max(0, prev.remainingSeconds - deltaSeconds);
          const newElapsed = session.durationMinutes * 60 - newRemaining;
          
          // Auto-end session when timer reaches 0
          if (newRemaining === 0) {
            endSession();
            return prev;
          }
          
          return {
            ...prev,
            remainingSeconds: newRemaining,
            elapsedSeconds: newElapsed
          };
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [timerState.isActive, timerState.isPaused, session]);

  const loadActiveSession = async () => {
    if (!user) return;

    try {
      console.log('🔍 Loading active session for subject:', subjectId);
      
      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading active session:', error);
        return;
      }

      if (data) {
        console.log('✅ Found active session:', data);
        
        const sessionData: PomodoroSession = {
          id: data.id,
          subjectId: data.subject_id,
          subjectName: subjectName,
          sessionType: data.session_type,
          durationMinutes: data.duration_minutes,
          startedAt: data.started_at,
          pausedAt: data.paused_at,
          endedAt: data.ended_at,
          isPaused: data.is_paused,
          remainingSeconds: data.remaining_seconds,
          status: data.status
        };

        setSession(sessionData);

        // Calculate timer state based on session data
        let remainingSeconds = sessionData.remainingSeconds;
        let elapsedSeconds = sessionData.durationMinutes * 60 - remainingSeconds;

        if (!sessionData.isPaused) {
          // If not paused, calculate remaining time from started_at
          const startedAt = new Date(sessionData.startedAt).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - startedAt) / 1000);
          remainingSeconds = Math.max(0, sessionData.durationMinutes * 60 - elapsed);
          elapsedSeconds = sessionData.durationMinutes * 60 - remainingSeconds;
        }

        setTimerState({
          isActive: remainingSeconds > 0,
          isPaused: sessionData.isPaused,
          remainingSeconds,
          elapsedSeconds
        });

        if (remainingSeconds > 0) {
          toast({
            title: "🎯 Session Resumed",
            description: `Your ${subjectName} session is still active. ${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s remaining.`,
          });
        }
      } else {
        console.log('ℹ️ No active session found');
        setSession(null);
        setTimerState({
          isActive: false,
          isPaused: false,
          remainingSeconds: defaultDurationSeconds,
          elapsedSeconds: 0
        });
      }
    } catch (error) {
      console.error('❌ Error in loadActiveSession:', error);
    }
  };

  const loadSubjectStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subject_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading subject stats:', error);
        return;
      }

      if (data) {
        setSubjectStats({
          totalFocusSeconds: data.total_focus_seconds,
          sessionsCompleted: data.sessions_completed,
          lastSessionCompletedAt: data.last_session_completed_at
        });
      } else {
        setSubjectStats({
          totalFocusSeconds: 0,
          sessionsCompleted: 0
        });
      }
    } catch (error) {
      console.error('❌ Error in loadSubjectStats:', error);
    }
  };

  const startSession = async (sessionType: string = 'focus', durationMinutes: number = defaultDurationMinutes) => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const durationSeconds = durationMinutes * 60;
      console.log('🚀 Starting new Pomodoro session:', { subjectId, subjectName, sessionType, durationMinutes });

      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .insert({
          user_id: user.id,
          subject_id: subjectId,
          session_type: sessionType,
          duration_minutes: durationMinutes,
          started_at: new Date().toISOString(),
          is_paused: false,
          remaining_seconds: durationSeconds,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error starting session:', error);
        toast({
          title: "❌ Error",
          description: "Failed to start session. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Session started successfully:', data);

      const sessionData: PomodoroSession = {
        id: data.id,
        subjectId: data.subject_id,
        subjectName: subjectName,
        sessionType: data.session_type,
        durationMinutes: data.duration_minutes,
        startedAt: data.started_at,
        isPaused: false,
        remainingSeconds: durationSeconds,
        status: data.status
      };

      setSession(sessionData);
      setTimerState({
        isActive: true,
        isPaused: false,
        remainingSeconds: durationSeconds,
        elapsedSeconds: 0
      });

      lastTickRef.current = Date.now();

      toast({
        title: "🍅 Session Started",
        description: `${durationMinutes}-minute ${sessionType} session for ${subjectName} has begun!`,
      });

    } catch (error) {
      console.error('❌ Error in startSession:', error);
      toast({
        title: "❌ Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pauseSession = async () => {
    if (!session || !timerState.isActive || timerState.isPaused) return;

    setIsLoading(true);
    try {
      console.log('⏸️ Pausing session:', session.id);

      const { error } = await supabase
        .from('user_daily_study_sessions')
        .update({
          is_paused: true,
          paused_at: new Date().toISOString(),
          remaining_seconds: timerState.remainingSeconds
        })
        .eq('id', session.id);

      if (error) {
        console.error('❌ Error pausing session:', error);
        return;
      }

      setTimerState(prev => ({ ...prev, isPaused: true }));
      setSession(prev => prev ? { ...prev, isPaused: true, pausedAt: new Date().toISOString() } : null);

      toast({
        title: "⏸️ Session Paused",
        description: `Your ${subjectName} session is paused. ${Math.floor(timerState.remainingSeconds / 60)}m ${timerState.remainingSeconds % 60}s remaining.`,
      });

    } catch (error) {
      console.error('❌ Error in pauseSession:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeSession = async () => {
    if (!session || !timerState.isActive || !timerState.isPaused) return;

    setIsLoading(true);
    try {
      console.log('▶️ Resuming session:', session.id);

      const { error } = await supabase
        .from('user_daily_study_sessions')
        .update({
          is_paused: false,
          paused_at: null,
          started_at: new Date().toISOString(), // Reset start time for accurate counting
          remaining_seconds: timerState.remainingSeconds
        })
        .eq('id', session.id);

      if (error) {
        console.error('❌ Error resuming session:', error);
        return;
      }

      setTimerState(prev => ({ ...prev, isPaused: false }));
      setSession(prev => prev ? { ...prev, isPaused: false, pausedAt: undefined } : null);
      lastTickRef.current = Date.now();

      toast({
        title: "▶️ Session Resumed",
        description: `Your ${subjectName} session continues! ${Math.floor(timerState.remainingSeconds / 60)}m ${timerState.remainingSeconds % 60}s remaining.`,
      });

    } catch (error) {
      console.error('❌ Error in resumeSession:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      console.log('⏹️ Ending session:', session.id);

      // Calculate actual duration
      const startedAt = new Date(session.startedAt).getTime();
      const endedAt = Date.now();
      const actualDurationSeconds = Math.floor((endedAt - startedAt) / 1000);

      const { error } = await supabase
        .from('user_daily_study_sessions')
        .update({
          ended_at: new Date().toISOString(),
          remaining_seconds: 0,
          status: 'completed'
        })
        .eq('id', session.id);

      if (error) {
        console.error('❌ Error ending session:', error);
        return;
      }

      // Update subject stats
      await updateSubjectStats(actualDurationSeconds);

      // Clear timer state
      setSession(null);
      setTimerState({
        isActive: false,
        isPaused: false,
        remainingSeconds: defaultDurationSeconds,
        elapsedSeconds: 0
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      toast({
        title: "✅ Session Complete",
        description: `Great job! You completed your ${subjectName} ${session.sessionType} session.`,
      });

    } catch (error) {
      console.error('❌ Error in endSession:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubjectStats = async (focusSeconds: number) => {
    if (!user) return;

    try {
      const { data: existingStats } = await supabase
        .from('user_subject_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .single();

      if (existingStats) {
        // Update existing stats
        const { error } = await supabase
          .from('user_subject_stats')
          .update({
            total_focus_seconds: existingStats.total_focus_seconds + focusSeconds,
            sessions_completed: existingStats.sessions_completed + 1,
            last_session_completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStats.id);

        if (error) {
          console.error('❌ Error updating subject stats:', error);
        }
      } else {
        // Create new stats
        const { error } = await supabase
          .from('user_subject_stats')
          .insert({
            user_id: user.id,
            subject_id: subjectId,
            total_focus_seconds: focusSeconds,
            sessions_completed: 1,
            last_session_completed_at: new Date().toISOString()
          });

        if (error) {
          console.error('❌ Error creating subject stats:', error);
        }
      }

      // Reload stats
      await loadSubjectStats();
    } catch (error) {
      console.error('❌ Error in updateSubjectStats:', error);
    }
  };

  const resetSession = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      console.log('🔄 Resetting session:', session.id);

      // End the current session
      await endSession();

      // Start a new session
      await startSession(session.sessionType, session.durationMinutes);

    } catch (error) {
      console.error('❌ Error in resetSession:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation warning for active sessions
  useEffect(() => {
    const confirmUnload = (e: BeforeUnloadEvent) => {
      if (timerState.isActive && !timerState.isPaused) {
        e.preventDefault();
        e.returnValue = "Your Pomodoro session is still running!";
        return "Your Pomodoro session is still running!";
      }
    };

    window.addEventListener("beforeunload", confirmUnload);
    return () => window.removeEventListener("beforeunload", confirmUnload);
  }, [timerState.isActive, timerState.isPaused]);

  // Format time helpers
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatProgress = (): number => {
    if (!session) return 0;
    const totalSeconds = session.durationMinutes * 60;
    return Math.round(((totalSeconds - timerState.remainingSeconds) / totalSeconds) * 100);
  };

  return {
    // State
    session,
    timerState,
    subjectStats,
    isLoading,
    
    // Actions
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    resetSession,
    
    // Utilities
    formatTime,
    formatProgress,
    defaultDurationMinutes
  };
}; 