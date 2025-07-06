
import React, { useState, useEffect } from 'react';
import { RotateCcw, Play, Pause, SkipForward, Maximize, Music, Settings, ArrowLeft } from 'lucide-react';
import { usePomodoroSession } from '@/hooks/usePomodoroSession';

interface Subject {
  id: number;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
  chapters?: any[];
}

interface StudyStats {
  timeSpentToday: number;
  timeSpentTotal: number;
  studyStreak: number;
  completedChapters: number;
  totalChapters: number;
}

interface StudySessionProps {
  subject: Subject;
  onBack: () => void;
  studyStats?: StudyStats;
}

export const StudySession = ({ subject, onBack, studyStats }: StudySessionProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionCount, setSessionCount] = useState(1);
  const [sessionType, setSessionType] = useState<'focused' | 'break'>('focused');
  const [totalTimeToday, setTotalTimeToday] = useState(studyStats?.timeSpentToday || 0);
  const [resetClickCount, setResetClickCount] = useState(0);
  
  // Use the Pomodoro session hook for database management
  const {
    activeSession,
    elapsedTime,
    isLoading: pomodoroLoading,
    startSession,
    endSession,
    resetSession
  } = usePomodoroSession();

  // Check if there's an active session for this subject
  const isActive = activeSession?.subjectId === subject.id;

  // Prevent auto-resume by clearing any existing session for this subject
  // Only run this once when component mounts, not when activeSession changes
  useEffect(() => {
    const clearExistingSession = async () => {
      if (activeSession && activeSession.subjectId === subject.id) {
        console.log('🔄 Clearing auto-resumed session to prevent auto-start');
        await endSession();
      }
    };
    clearExistingSession();
  }, []); // Only run on mount, not when activeSession changes

  // Update total time today when session is active
  useEffect(() => {
    if (isActive && elapsedTime > 0) {
      setTotalTimeToday(studyStats?.timeSpentToday + elapsedTime);
    }
  }, [isActive, elapsedTime, studyStats?.timeSpentToday]);

  // Auto-advance to next session when timer reaches 0
  useEffect(() => {
    if (isActive && timeLeft === 0) {
      handleSkip();
    }
  }, [isActive, timeLeft]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (isActive) {
      // Stop the session
      console.log('⏸️ Stopping session');
      await endSession();
    } else {
      // Start a new session
      console.log('▶️ Starting new session for subject:', subject.name);
      await startSession(subject.id, subject.name, sessionType);
    }
  };

  const handleReset = async () => {
    if (resetClickCount === 0) {
      setResetClickCount(1);
      setTimeout(() => setResetClickCount(0), 2000);
      setTimeLeft(sessionType === 'focused' ? 25 * 60 : 5 * 60);
      if (isActive) {
        await endSession();
      }
    } else {
      // Double reset - reset all
      setSessionCount(0);
      setTimeLeft(25 * 60);
      if (isActive) {
        await endSession();
      }
      setSessionType('focused');
      setResetClickCount(0);
    }
  };

  const handleSkip = async () => {
    if (sessionType === 'focused') {
      // Switch to break
      setSessionType('break');
      setTimeLeft(sessionCount % 3 === 0 ? 20 * 60 : 5 * 60); // Long break every 3 sessions
    } else {
      // Switch to focus
      setSessionType('focused');
      setTimeLeft(25 * 60);
      setSessionCount(prev => prev + 1);
    }
    if (isActive) {
      await endSession();
    }
  };

  const progress = sessionType === 'focused' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="px-6 py-4">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to subjects</span>
        </button>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pomodoro Timer Card */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-slate-800 relative">
          {/* Top Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500 text-white text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center">
              {sessionCount}
            </div>
            <div className="flex items-center space-x-4">
              <Maximize className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
              <Music className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
              <Settings className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Circular Timer */}
          <div className="relative w-full max-w-[320px] aspect-square mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
              {/* Background circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="#2e2e35"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke={sessionType === 'focused' ? '#f97316' : '#10b981'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
              />
            </svg>
            
            {/* Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-400 mb-2">
                {isActive ? sessionType : 'paused'}
              </p>
              <p className="text-5xl font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </p>
              <p className="text-xs text-gray-500">
                {formatTotalTime(totalTimeToday)}
              </p>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handleReset}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              {isActive ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
            
            <button
              onClick={handleSkip}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Study Insight Card */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-slate-800 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">{subject.name}</h2>
            <span className="text-orange-400 text-sm font-medium">{subject.progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${subject.progress}%` }}
            />
          </div>

          {/* Stats Boxes */}
          <div className="space-y-4 flex-1">
            <div className="bg-[#2a2a2f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Today</p>
              <p className="text-lg font-semibold text-white">
                {studyStats ? 
                  (() => {
                    const hours = Math.floor(studyStats.timeSpentToday / 3600);
                    const minutes = Math.floor((studyStats.timeSpentToday % 3600) / 60);
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    } else {
                      return `${minutes}m`;
                    }
                  })() : 
                  `${Math.floor(totalTimeToday / 60)}m`
                }
              </p>
            </div>
            
            <div className="bg-[#2a2a2f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Total</p>
              <p className="text-lg font-semibold text-white">
                {studyStats ? 
                  (() => {
                    const hours = Math.floor(studyStats.timeSpentTotal / 3600);
                    const minutes = Math.floor((studyStats.timeSpentTotal % 3600) / 60);
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    } else {
                      return `${minutes}m`;
                    }
                  })() : 
                  subject.timeSpent
                }
              </p>
            </div>
            
            <div className="bg-[#2a2a2f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Parts Done</p>
              <p className="text-lg font-semibold text-white">
                {studyStats ? `${studyStats.completedChapters}/${studyStats.totalChapters}` : '0/0'}
              </p>
            </div>
          </div>

          {/* Study Streak Footer */}
          <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center text-sm">
            <span className="text-gray-400">Study Streak</span>
            <span className="text-orange-400 font-medium">
              {studyStats ? `${studyStats.studyStreak} days` : '0 days'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
