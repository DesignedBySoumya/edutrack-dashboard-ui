
import React from 'react';

export const SummaryBox = () => {
  return (
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <div className="text-sm text-gray-400 mb-1">Filter</div>
        </div>
        <div className="flex space-x-8">
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Completed</div>
            <div className="text-lg font-semibold text-white">8.80%</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Time Spent</div>
            <div className="text-lg font-semibold text-white">50h 05m</div>
          </div>
        </div>
      </div>
    </div>
  );
};
