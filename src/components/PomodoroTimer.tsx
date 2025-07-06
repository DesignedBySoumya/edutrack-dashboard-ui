import React, { useState, useEffect } from 'react';
import { usePomodoroSession } from '../hooks/usePomodoroSession';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';
import { Badge } from './ui/badge';

interface PomodoroTimerProps {
  subjectId: number;
  subjectName: string;
  onSessionEnd?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  subjectId, 
  subjectName, 
  onSessionEnd 
}) => {
  const {
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
  } = usePomodoroSession();

  const [isPaused, setIsPaused] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<'work' | 'break' | 'longBreak'>('work');
  
  // Pomodoro settings (25min work, 5min break, 15min long break)
  const WORK_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes
  const SESSIONS_BEFORE_LONG_BREAK = 4;

  const [completedSessions, setCompletedSessions] = useState(0);

  // Check if this subject is currently active
  const isActive = activeSession?.subjectId === subjectId;

  // Calculate progress
  const getCurrentPhaseTime = () => {
    switch (pomodoroPhase) {
      case 'work': return WORK_TIME;
      case 'break': return BREAK_TIME;
      case 'longBreak': return LONG_BREAK_TIME;
      default: return WORK_TIME;
    }
  };

  const currentPhaseTime = getCurrentPhaseTime();
  const progress = Math.min((elapsedTime / currentPhaseTime) * 100, 100);
  const timeRemaining = Math.max(currentPhaseTime - elapsedTime, 0);

  // Auto-advance phases
  useEffect(() => {
    if (isActive && !isPaused && elapsedTime >= currentPhaseTime) {
      handlePhaseComplete();
    }
  }, [elapsedTime, currentPhaseTime, isActive, isPaused]);

  // Load stats on mount
  useEffect(() => {
    fetchSessionStats(subjectId);
  }, [subjectId, fetchSessionStats]);

  const handleStart = async () => {
    if (isActive) {
      // Resume paused session
      setIsPaused(false);
    } else {
      // Start new session
      await startSession(subjectId, subjectName, 'pomodoro');
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = async () => {
    if (isActive) {
      await endSession();
      setIsPaused(false);
      setPomodoroPhase('work');
      setCompletedSessions(0);
      onSessionEnd?.();
    }
  };

  const handleReset = async () => {
    await resetSession();
    setIsPaused(false);
    setPomodoroPhase('work');
    setCompletedSessions(0);
  };

  const handlePhaseComplete = async () => {
    if (pomodoroPhase === 'work') {
      setCompletedSessions(prev => prev + 1);
      
      // Check if it's time for a long break
      if ((completedSessions + 1) % SESSIONS_BEFORE_LONG_BREAK === 0) {
        setPomodoroPhase('longBreak');
      } else {
        setPomodoroPhase('break');
      }
    } else {
      // Break completed, back to work
      setPomodoroPhase('work');
    }

    // Reset timer for new phase
    // setElapsedTime(0); // This line was removed as per the new_code, as elapsedTime is now managed by usePomodoroSession
  };

  const getPhaseColor = () => {
    switch (pomodoroPhase) {
      case 'work': return 'bg-red-500';
      case 'break': return 'bg-green-500';
      case 'longBreak': return 'bg-blue-500';
      default: return 'bg-red-500';
    }
  };

  const getPhaseName = () => {
    switch (pomodoroPhase) {
      case 'work': return 'Focus Time';
      case 'break': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  const getPhaseIcon = () => {
    switch (pomodoroPhase) {
      case 'work': return '🎯';
      case 'break': return '☕';
      case 'longBreak': return '🌴';
      default: return '🎯';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <span className="text-2xl">{getPhaseIcon()}</span>
          <span>{getPhaseName()}</span>
        </CardTitle>
        <div className="text-sm text-gray-600">
          {subjectName}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {formatTime(elapsedTime)} elapsed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.floor(progress)}% complete</span>
            <span>Phase {pomodoroPhase === 'work' ? completedSessions + 1 : 'Break'}</span>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Today</div>
            <div className="font-semibold">{formatMinutes(sessionStats.totalTimeToday)}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total</div>
            <div className="font-semibold">{formatMinutes(sessionStats.totalTimeAll)}</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-2">
          {!isActive ? (
            <Button 
              onClick={handleStart} 
              disabled={isLoading}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button 
                  onClick={handleResume} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button 
                  onClick={handlePause} 
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button 
                onClick={handleStop} 
                disabled={isLoading}
                variant="destructive"
                size="icon"
              >
                <Square className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Reset Button */}
        {isActive && (
          <div className="text-center">
            <Button 
              onClick={handleReset} 
              disabled={isLoading}
              variant="ghost" 
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Session
            </Button>
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex justify-center gap-2">
          {isActive && (
            <Badge variant="default" className={getPhaseColor()}>
              {isPaused ? '⏸️ Paused' : '▶️ Active'}
            </Badge>
          )}
          <Badge variant="outline">
            {completedSessions} completed
          </Badge>
        </div>

        {/* Session Info */}
        {isActive && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800">
              ✅ Session is saved - you can safely reload or navigate away
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer; 