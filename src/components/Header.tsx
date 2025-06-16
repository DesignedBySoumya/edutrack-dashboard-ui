
import React from 'react';
import { ChevronDown, Calendar, Settings, Share } from 'lucide-react';

export const Header = () => {
  return (
    <div className="bg-gray-900 px-4 py-4 border-b border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            <span className="text-sm font-medium text-white">UPSC CSE</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <Share className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
};
