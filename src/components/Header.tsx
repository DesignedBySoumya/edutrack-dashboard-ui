
import React from 'react';
import { ChevronDown, Calendar, Settings, Share } from 'lucide-react';

export const Header = () => {
  return (
    <div className="bg-slate-900 px-6 py-5 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-500 hover:brightness-110 px-4 py-2 rounded-lg transition-all">
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
