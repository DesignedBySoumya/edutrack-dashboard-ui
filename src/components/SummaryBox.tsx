
import React from 'react';

export const SummaryBox = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 min-w-[120px]">
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1">Completed</div>
        <div className="text-lg font-bold text-white mb-3">8.80%</div>
        <div className="text-xs text-gray-400 mb-1">Time Spent</div>
        <div className="text-sm font-semibold text-white">50h 05m</div>
      </div>
    </div>
  );
};
