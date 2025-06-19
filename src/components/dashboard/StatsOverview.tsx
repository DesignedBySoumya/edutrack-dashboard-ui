
import React from 'react';

export const StatsOverview = () => {
  return (
    <div className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left side - Filter buttons */}
        <div className="flex space-x-3">
          <button className="py-2 px-4 rounded-lg text-sm font-medium bg-blue-500 text-white">
            All (6)
          </button>
          <button className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all">
            Due (6)
          </button>
        </div>

        {/* Right side - Stats */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="text-center sm:text-right">
            <div className="text-sm text-gray-400 mb-1">Completed</div>
            <div className="text-lg font-semibold text-white">8.80%</div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm text-gray-400 mb-1">Time Spent</div>
            <div className="text-lg font-semibold text-white">50h 05m</div>
          </div>
        </div>
      </div>
    </div>
  );
};
