
import React from 'react';
import { Crown } from 'lucide-react';

interface AddUnitButtonProps {
  onAddUnit: (e: React.MouseEvent) => void;
}

export const AddUnitButton = ({ onAddUnit }: AddUnitButtonProps) => {
  return (
    <div className="p-5 pl-8">
      <button
        onClick={onAddUnit}
        className="flex items-center justify-center space-x-2 text-sm font-bold text-gray-300 hover:text-white transition-colors border-2 border-yellow-400 hover:border-yellow-300 rounded-xl px-5 py-2.5 hover:shadow-sm transition-all duration-200 w-full mt-4"
      >
        <span>Add New Unit</span>
        <Crown className="w-4 h-4" />
      </button>
    </div>
  );
};
