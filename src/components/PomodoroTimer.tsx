
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, Music, Maximize2, Settings } from 'lucide-react';

interface PomodoroTimerProps {
  subjectName: string;
  subjectProgress: number;
  onBack: () => void;
}

export const PomodoroTimer = ({ subjectName, subjectProgress, onBack }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [todayTimeSpent, setTodayTimeSpent] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(3660); // Sample data
  const [partsCompleted] = useState(5);
  const [totalParts] = useState(16);
  const [studyStreak] = useState(4);
  const [sessionCount, setSessionCount] = useState(1);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsPlaying(false);
            setSessionCount(prev => prev + 1);
            return 25 * 60; // Reset to 25 minutes
          }
          return time - 1;
        });
        setTodayTimeSpent((time) => time + 1);
        setTotalTimeSpent((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeShort = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeTotal = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}h`;
    }
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsPlaying(false);
  };

  const handleFullscreen = () => {
    document.documentElement.requestFullscreen();
    setIsPlaying(true);
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <div className="px-6 py-4 border-b border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to Subjects</span>
        </button>
      </div>

      {/* Pomodoro Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
        {/* Left: Pomodoro Timer Card */}
        <div className="bg-[#1a1a1f] rounded-xl p-6 relative shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-red-500 text-white text-xs font-medium rounded-full px-3 py-1">
              Session {sessionCount}
            </span>
            <div className="flex space-x-3">
              <Maximize2 
                className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors" 
                onClick={handleFullscreen}
              />
              <Music 
                className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors"
              />
              <Settings 
                className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Timer Circle */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full max-w-[280px] mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="#2e2e35"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="#f97316"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">
                    {isPlaying ? 'focused' : 'paused'}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">{formatTime(timeLeft)}</h1>
                  <p className="text-xs text-gray-500">Pomodoro Timer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button 
              onClick={resetTimer}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
          </div>
        </div>

        {/* Right: Study Stats Card */}
        <div className="bg-[#1a1a1f] rounded-xl p-6 shadow-lg border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold truncate">{subjectName}</h3>
            <span className="text-orange-400 text-sm font-medium">{Math.round(subjectProgress)}%</span>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 ease-out" 
              style={{ width: `${subjectProgress}%` }}
            ></div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#2a2a2f] rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Today</p>
              <p className="text-lg font-semibold">{formatTimeShort(todayTimeSpent)}</p>
            </div>
            
            <div className="bg-[#2a2a2f] rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Total</p>
              <p className="text-lg font-semibold">{formatTimeTotal(totalTimeSpent)}</p>
            </div>
            
            <div className="bg-[#2a2a2f] rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Parts Done</p>
              <p className="text-lg font-semibold">{partsCompleted}/{totalParts}</p>
            </div>
          </div>

          {/* Study Streak */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Study Streak</span>
              <span className="text-orange-400 font-medium">{studyStreak} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
