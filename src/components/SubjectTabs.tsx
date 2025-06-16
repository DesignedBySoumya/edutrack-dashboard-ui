
import React from 'react';

interface SubjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SubjectTabs = ({ activeTab, onTabChange }: SubjectTabsProps) => {
  return (
    <div className="bg-slate-900 px-6 pb-4">
      <div className="flex space-x-3 mt-4">
        <button
          onClick={() => onTabChange('all')}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          All (6)
        </button>
        <button
          onClick={() => onTabChange('due')}
          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'due'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Due (6)
        </button>
      </div>
    </div>
  );
};
