
import React from 'react';
import { Home, BookOpen, Clock, User } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex space-x-8">
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Study</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
            <span className="text-xs">Timer</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
        
        {/* TickOff Button */}
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105">
          TickOff
        </button>
      </div>
    </div>
  );
};
