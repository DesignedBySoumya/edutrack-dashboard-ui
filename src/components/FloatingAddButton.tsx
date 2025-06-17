
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
    >
      <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
    </button>
  );
};
