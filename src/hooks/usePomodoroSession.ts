import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './use-toast';

interface ActiveSession {
  subjectId: number;
  subjectName: string;
  startedAt: string;
  sessionType: string;
  sessionId?: string;
}

interface SessionStats {
  totalTimeToday: number;
  totalTimeAll: number;
  currentStreak: number;
}

export const usePomodoroSession = () => {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalTimeToday: 0,
    totalTimeAll: 0,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load active session from database on mount
  useEffect(() => {
    const loadActiveSessionFromDB = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.log('No authenticated user found');
          return;
        }

        // Check for active session in database (session without ended_at)
        const { data: activeSessions, error: fetchError } = await supabase
          .from('user_daily_study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .is('ended_at', null)
          .order('started_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error('❌ Error fetching active sessions:', fetchError);
          return;
        }

        if (activeSessions && activeSessions.length > 0) {
          const dbSession = activeSessions[0];
          const sessionStartTime = new Date(dbSession.started_at);
          const elapsed = Date.now() - sessionStartTime.getTime();
          
          // Only resume if session is less than 4 hours old (to prevent stale sessions)
          if (elapsed < 4 * 60 * 60 * 1000) {
            // Get the actual subject name from the database
            let subjectName = `Subject ${dbSession.subject_id}`;
            try {
              const { data: subjectData, error: subjectError } = await supabase
                .from('subjects')
                .select('name')
                .eq('id', dbSession.subject_id)
                .single();
              
              if (!subjectError && subjectData) {
                subjectName = subjectData.name;
              }
            } catch (error) {
              console.log('Could not fetch subject name, using default');
            }

            const activeSession: ActiveSession = {
              subjectId: dbSession.subject_id,
              subjectName: subjectName,
              startedAt: dbSession.started_at,
              sessionType: dbSession.session_type || 'focus',
              sessionId: dbSession.id
            };

            setActiveSession(activeSession);
            setElapsedTime(Math.floor(elapsed / 1000));
            
            // Save to localStorage for quick access
            localStorage.setItem('activeSession', JSON.stringify(activeSession));
            
            toast({
              title: "Session Active",
              description: `${activeSession.subjectName} - ${Math.floor(elapsed / 60000)}m studied`,
            });
            
            console.log('✅ Resumed session from database:', activeSession);
          } else {
            // Clear stale session from database
            console.log('🧹 Clearing stale session from database');
            await supabase
              .from('user_daily_study_sessions')
              .update({ ended_at: new Date().toISOString() })
              .eq('id', dbSession.id);
          }
        } else {
          // Fallback to localStorage if no active session in database
          const savedSession = localStorage.getItem('activeSession');
          if (savedSession) {
            try {
              const session: ActiveSession = JSON.parse(savedSession);
              const elapsed = Date.now() - new Date(session.startedAt).getTime();
              
              if (elapsed < 4 * 60 * 60 * 1000) {
                setActiveSession(session);
                setElapsedTime(Math.floor(elapsed / 1000));
                
                          toast({
            title: "Session Active",
            description: `${session.subjectName} - ${Math.floor(elapsed / 60000)}m studied`,
          });
                
                console.log('✅ Resumed session from localStorage (fallback):', session);
              } else {
                localStorage.removeItem('activeSession');
                console.log('🧹 Cleared stale session from localStorage');
              }
            } catch (error) {
              console.error('❌ Error parsing saved session:', error);
              localStorage.removeItem('activeSession');
            }
          }
        }
      } catch (error) {
        console.error('❌ Error loading active session:', error);
      }
    };

    loadActiveSessionFromDB();
  }, [toast]);

  // Timer effect
  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSession]);

  // No navigation blocking needed since sessions are persisted in database
  // Users can safely reload or navigate away - session will be restored

  // Start a new session
  const startSession = useCallback(async (subjectId: number, subjectName: string, sessionType: string = 'focus') => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Check if there's already an active session
      const { data: existingSessions, error: checkError } = await supabase
        .from('user_daily_study_sessions')
        .select('id')
        .eq('user_id', user.id)
        .is('ended_at', null);

      if (checkError) {
        console.error('❌ Error checking existing sessions:', checkError);
      } else if (existingSessions && existingSessions.length > 0) {
        // End any existing sessions first
        console.log('🔄 Ending existing active session before starting new one');
        await supabase
          .from('user_daily_study_sessions')
          .update({ ended_at: new Date().toISOString() })
          .in('id', existingSessions.map(s => s.id));
      }

      const sessionData = {
        user_id: user.id,
        subject_id: subjectId,
        started_at: new Date().toISOString(),
        session_type: sessionType
      };

      console.log('🔍 Starting session with data:', sessionData);

      const { data: insertedSession, error: sessionError } = await supabase
        .from('user_daily_study_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (sessionError) {
        console.error('❌ Error starting session:', sessionError);
        throw new Error(`Failed to start session: ${sessionError.message}`);
      }

      const newActiveSession: ActiveSession = {
        subjectId,
        subjectName,
        startedAt: sessionData.started_at,
        sessionType,
        sessionId: insertedSession.id
      };

      // Save to localStorage for quick access
      localStorage.setItem('activeSession', JSON.stringify(newActiveSession));
      
      // Update state
      setActiveSession(newActiveSession);
      setElapsedTime(0);

      console.log('✅ Session started successfully and stored in database:', insertedSession);
      
      toast({
        title: "🎯 Study Session Started",
        description: `Started studying ${subjectName}`,
      });

      // Refresh stats
      await fetchSessionStats(subjectId);

    } catch (error) {
      console.error('❌ Error in startSession:', error);
      toast({
        title: "Session Error",
        description: error instanceof Error ? error.message : "Failed to start session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // End the current session
  const endSession = useCallback(async (forceEnd: boolean = false) => {
    if (!activeSession) return;

    try {
      setIsLoading(true);

      const sessionEndTime = new Date().toISOString();
      console.log('🔍 Ending session at:', sessionEndTime);

      // Update session in Supabase with ended_at timestamp
      // This will automatically calculate duration_minutes via the generated column
      const { error: updateError } = await supabase
        .from('user_daily_study_sessions')
        .update({
          ended_at: sessionEndTime
        })
        .eq('id', activeSession.sessionId)
        .is('ended_at', null);

      if (updateError) {
        console.error('❌ Error ending session:', updateError);
        throw new Error(`Failed to end session: ${updateError.message}`);
      }

      // Clear localStorage
      localStorage.removeItem('activeSession');

      // Reset state
      setActiveSession(null);
      setElapsedTime(0);

      console.log('✅ Session ended successfully and stored in database');

      toast({
        title: "✅ Study Session Ended",
        description: `Completed studying ${activeSession.subjectName}`,
      });

      // Refresh stats
      await fetchSessionStats(activeSession.subjectId);

    } catch (error) {
      console.error('❌ Error in endSession:', error);
      toast({
        title: "Session Error",
        description: error instanceof Error ? error.message : "Failed to end session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeSession, toast]);

  // Reset session (force end)
  const resetSession = useCallback(async () => {
    if (!activeSession) return;

    const confirmed = window.confirm(
      `⚠️ Are you sure you want to end your current session?\n\nSubject: ${activeSession.subjectName}\nElapsed: ${Math.floor(elapsedTime / 60)}m ${elapsedTime % 60}s`
    );

    if (confirmed) {
      await endSession(true);
    }
  }, [activeSession, elapsedTime, endSession]);

  // Fetch session statistics
  const fetchSessionStats = useCallback(async (subjectId: number) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      // Get today's sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfToday = today.toISOString();

      const { data: todaySessions, error: todayError } = await supabase
        .from('user_daily_study_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .gte('started_at', startOfToday)
        .not('ended_at', 'is', null);

      if (todayError) {
        console.error('❌ Error fetching today sessions:', todayError);
        return;
      }

      // Get all sessions
      const { data: allSessions, error: allError } = await supabase
        .from('user_daily_study_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .not('ended_at', 'is', null);

      if (allError) {
        console.error('❌ Error fetching all sessions:', allError);
        return;
      }

      const totalTimeToday = (todaySessions || []).reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
      const totalTimeAll = (allSessions || []).reduce((sum, session) => sum + (session.duration_minutes || 0), 0);

      setSessionStats({
        totalTimeToday,
        totalTimeAll,
        currentStreak: 0 // TODO: Implement streak calculation
      });

      console.log('📊 Session stats updated:', { totalTimeToday, totalTimeAll });

    } catch (error) {
      console.error('❌ Error fetching session stats:', error);
    }
  }, []);

  // Format time helpers
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };

  return {
    activeSession,
    elapsedTime,
    sessionStats,
    isLoading,
    startSession,
    endSession,
    resetSession,
    fetchSessionStats,
    formatTime,
    formatMinutes
  };
}; 