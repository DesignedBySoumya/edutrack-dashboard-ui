
import React from 'react';
import { Grid3X3, Menu, FileText, BarChart3 } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-4 sm:px-6 py-3 sm:py-4 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button className="flex flex-col items-center space-y-1 text-blue-500 transition-colors p-2">
          <Grid3X3 className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors p-2">
          <Menu className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors p-2">
          <FileText className="w-6 h-6" />
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors p-2">
          <BarChart3 className="w-6 h-6" />
        </button>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-2 rounded-lg transition-all duration-200 text-sm min-w-[80px] flex-shrink-0">
          TickOff
        </button>
      </div>
    </div>
  );
};
