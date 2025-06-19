
import React from 'react';

interface SubjectProgressProps {
  progress: number;
  color: string;
}

export const SubjectProgress = ({ progress, color }: SubjectProgressProps) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (Math.round(progress) / 100) * circumference;

  const getSubjectColor = () => {
    switch (color) {
      case 'blue':
      case 'green': 
      case 'purple':
      default:
        return '#FACC15'; // Yellow for completed
    }
  };

  return (
    <div className="relative mr-5 flex-shrink-0">
      <svg width="72" height="72" className="transform -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="#2C2F3C"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          strokeWidth="4"
          fill="none"
          stroke={getSubjectColor()}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-semibold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
