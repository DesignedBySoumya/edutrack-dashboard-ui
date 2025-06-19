
import React from 'react';
import { Play, Pause } from 'lucide-react';

interface SubjectCardActionsProps {
  isPlaying: boolean;
  onPlayPause: (e: React.MouseEvent) => void;
}

export const SubjectCardActions = ({ isPlaying, onPlayPause }: SubjectCardActionsProps) => {
  return (
    <button
      onClick={onPlayPause}
      className="w-14 h-14 rounded-full bg-yellow-400 hover:bg-orange-400 flex items-center justify-center transition-all duration-200 transform hover:brightness-110 flex-shrink-0 ml-5"
    >
      {isPlaying ? (
        <Pause className="w-7 h-7 text-black" />
      ) : (
        <Play className="w-7 h-7 text-black ml-0.5" />
      )}
    </button>
  );
};
