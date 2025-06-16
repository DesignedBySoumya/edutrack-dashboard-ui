
import React from 'react';

export const SummaryBox = () => {
  return (
    <div className="bg-gray-900 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <div className="text-xs text-gray-400 mb-1">Filter</div>
        </div>
        <div className="flex space-x-8">
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Completed</div>
            <div className="text-lg font-bold text-white">8.80%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Time Spent</div>
            <div className="text-lg font-bold text-white">50h 05m</div>
          </div>
        </div>
      </div>
    </div>
  );
};
