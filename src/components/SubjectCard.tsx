
import React from 'react';
import { Play, Pause } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
}

interface SubjectCardProps {
  subject: Subject;
  onPlayPause: () => void;
}

export const SubjectCard = ({ subject, onPlayPause }: SubjectCardProps) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'stroke-blue-500 text-blue-500',
      green: 'stroke-green-500 text-green-500',
      purple: 'stroke-purple-500 text-purple-500',
      orange: 'stroke-orange-500 text-orange-500',
      teal: 'stroke-teal-500 text-teal-500',
      pink: 'stroke-pink-500 text-pink-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'stroke-blue-500 text-blue-500';
  };

  const getPlayButtonColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      teal: 'bg-teal-500 hover:bg-teal-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-500 hover:bg-blue-600';
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (subject.progress / 100) * circumference;

  return (
    <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        {/* Progress Ring */}
        <div className="relative">
          <svg width="48" height="48" className="transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="24"
              cy="24"
              r="18"
              strokeWidth="3"
              fill="none"
              className={getColorClasses(subject.color)}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${getColorClasses(subject.color)}`}>
              {subject.progress}%
            </span>
          </div>
        </div>

        {/* Subject Info */}
        <div className="flex-1 ml-4">
          <h3 className="text-sm font-medium text-white mb-1">{subject.name}</h3>
          <p className="text-xs text-gray-400">{subject.timeSpent}</p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getPlayButtonColor(
            subject.color
          )}`}
        >
          {subject.isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
