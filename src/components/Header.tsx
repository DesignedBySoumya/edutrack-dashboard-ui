
import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <div className="bg-gray-800 px-4 py-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
            <span className="text-sm font-medium">UPSC CSE</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Study Dashboard
        </div>
      </div>
    </div>
  );
};
