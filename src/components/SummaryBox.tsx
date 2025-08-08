import React from 'react';

interface SummaryBoxProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalSubjects: number;
  dueSubjects: number;
  completionPercentage: number;
  totalTimeSpent: string;
}

export const SummaryBox = ({ 
  activeTab, 
  onTabChange, 
  totalSubjects, 
  dueSubjects, 
  completionPercentage, 
  totalTimeSpent 
}: SummaryBoxProps) => {
  return (
    <div className="bg-slate-900 px-3 py-3 sm:px-6 sm:py-4 max-[365px]:px-4 max-[365px]:py-3">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-6 max-[365px]:gap-2">

        {/* Filter Section */}
        <div className="flex flex-col text-xs sm:text-sm">
          <span className="text-gray-400 font-medium mb-1">Filter</span>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => onTabChange('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition max-[365px]:min-h-[36px] ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              All ({totalSubjects})
            </button>
            <button
              onClick={() => onTabChange('due')}
              className={`px-3 py-1.5 rounded-md font-medium transition max-[365px]:min-h-[36px] ${
                activeTab === 'due'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Due ({dueSubjects})
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex gap-4 sm:gap-8 shrink-0 text-right text-xs sm:text-sm max-[365px]:gap-3">
          <div>
            <div className="text-gray-400">Completed</div>
            <div className="text-white font-semibold text-base sm:text-lg max-[365px]:text-base">{completionPercentage.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-400">Time Spent</div>
            <div className="text-white font-semibold text-base sm:text-lg max-[365px]:text-base">{totalTimeSpent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
