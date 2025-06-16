
import React from 'react';
import { Play, Pause, ChevronDown } from 'lucide-react';

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
      blue: 'stroke-orange-500',
      green: 'stroke-yellow-500',
      purple: 'stroke-yellow-500',
      orange: 'stroke-orange-500',
      teal: 'stroke-teal-500',
      pink: 'stroke-pink-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'stroke-orange-500';
  };

  const getPlayButtonColor = (color: string) => {
    const colorMap = {
      blue: 'bg-orange-500 hover:bg-orange-600',
      green: 'bg-yellow-500 hover:bg-yellow-600',
      purple: 'bg-yellow-500 hover:bg-yellow-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      teal: 'bg-teal-500 hover:bg-teal-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-orange-500 hover:bg-orange-600';
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (subject.progress / 100) * circumference;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mx-4 mb-4 border border-gray-700">
      <div className="flex items-center justify-between">
        {/* Progress Ring */}
        <div className="relative mr-4">
          <svg width="56" height="56" className="transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="28"
              cy="28"
              r="20"
              strokeWidth="4"
              fill="none"
              className={getColorClasses(subject.color)}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {subject.progress}%
            </span>
          </div>
        </div>

        {/* Subject Info */}
        <div className="flex-1">
          <h3 className="text-base font-medium text-white mb-1">{subject.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{subject.timeSpent}</p>
          <button className="flex items-center text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <span>See Details</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${getPlayButtonColor(
            subject.color
          )}`}
        >
          {subject.isPlaying ? (
            <Pause className="w-5 h-5 text-black" />
          ) : (
            <Play className="w-5 h-5 text-black ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
