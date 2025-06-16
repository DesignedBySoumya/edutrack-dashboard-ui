
import React from 'react';
import { Grid3X3, Menu, FileText, BarChart3 } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex space-x-8">
          <button className="flex flex-col items-center space-y-1 text-blue-500 transition-colors">
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
        
        {/* TickOff Button */}
        <button className="bg-yellow-400 hover:bg-orange-400 text-black px-6 py-2 rounded-full font-medium text-sm transition-all hover:brightness-110">
          TickOff
        </button>
      </div>
    </div>
  );
};
