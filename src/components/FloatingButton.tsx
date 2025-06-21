
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};
