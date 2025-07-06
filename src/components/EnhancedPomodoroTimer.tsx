import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer';

interface EnhancedPomodoroTimerProps {
  subjectId: number;
  subjectName: string;
  onSessionEnd?: () => void;
}

export const EnhancedPomodoroTimer: React.FC<EnhancedPomodoroTimerProps> = ({
  subjectId,
  subjectName,
  onSessionEnd
}) => {
  const {
    session,
    timerState,
    subjectStats,
    isLoading,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    resetSession,
    formatTime,
    formatProgress,
    defaultDurationMinutes
  } = usePomodoroTimer(subjectId, subjectName);

  const handleSessionEnd = () => {
    if (onSessionEnd) {
      onSessionEnd();
    }
  };

  const handleEndSession = async () => {
    await endSession();
    handleSessionEnd();
  };

  const handleResetSession = async () => {
    await resetSession();
    handleSessionEnd();
  };

  const getStatusColor = () => {
    if (timerState.isPaused) return 'text-yellow-600';
    if (timerState.isActive) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (timerState.isPaused) return <Pause className="w-4 h-4" />;
    if (timerState.isActive) return <Play className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (timerState.isPaused) return 'Paused';
    if (timerState.isActive) return 'Active';
    return 'Ready';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          Pomodoro Timer
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {formatTime(timerState.remainingSeconds)}
          </div>
          <div className="text-sm text-gray-600">
            {timerState.isActive ? (
              <span className="text-green-600">
                {Math.floor(timerState.elapsedSeconds / 60)}m {timerState.elapsedSeconds % 60}s elapsed
              </span>
            ) : (
              <span>25 minutes remaining</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{formatProgress()}%</span>
          </div>
          <Progress value={formatProgress()} className="h-3" />
        </div>

        {/* Session Info */}
        {session && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="font-semibold">Active Session</div>
              <div>Subject: {session.subjectName}</div>
              <div>Type: {session.sessionType}</div>
              <div>Duration: {session.durationMinutes} minutes</div>
              <div>Status: {session.status}</div>
              <div>Started: {new Date(session.startedAt).toLocaleTimeString()}</div>
              {session.pausedAt && (
                <div>Paused: {new Date(session.pausedAt).toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Warning for Active Sessions */}
        {timerState.isActive && !timerState.isPaused && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span>⚠️ Don't navigate away during active session</span>
            </div>
          </div>
        )}

        {/* Paused Session Info */}
        {timerState.isPaused && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <Pause className="w-4 h-4" />
              <span>Session is paused - you can safely navigate away</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!timerState.isActive ? (
            <Button
              onClick={() => startSession('focus')}
              disabled={isLoading}
              className="flex-1"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              {timerState.isPaused ? (
                <Button
                  onClick={resumeSession}
                  disabled={isLoading}
                  className="flex-1"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={pauseSession}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleEndSession}
                disabled={isLoading}
                variant="destructive"
                size="lg"
              >
                <Square className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleResetSession}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Quick Session Types */}
        {!timerState.isActive && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Quick Start:</div>
            <div className="flex gap-2">
              <Button
                onClick={() => startSession('focus', 25)}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                🎯 Focus (25m)
              </Button>
              <Button
                onClick={() => startSession('short_break', 5)}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                ☕ Break (5m)
              </Button>
              <Button
                onClick={() => startSession('long_break', 15)}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                🌟 Long Break (15m)
              </Button>
            </div>
          </div>
        )}

        {/* Session Stats */}
        {session && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-900">
                {Math.floor(timerState.elapsedSeconds / 60)}m {timerState.elapsedSeconds % 60}s
              </div>
              <div className="text-gray-600">Elapsed</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-900">
                {Math.floor(timerState.remainingSeconds / 60)}m {timerState.remainingSeconds % 60}s
              </div>
              <div className="text-gray-600">Remaining</div>
            </div>
          </div>
        )}

        {/* Subject Stats */}
        {subjectStats && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800">
              <div className="font-semibold">Subject Statistics</div>
              <div>Total Focus: {Math.floor(subjectStats.totalFocusSeconds / 60)}m {subjectStats.totalFocusSeconds % 60}s</div>
              <div>Sessions Completed: {subjectStats.sessionsCompleted}</div>
              {subjectStats.lastSessionCompletedAt && (
                <div>Last Session: {new Date(subjectStats.lastSessionCompletedAt).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 