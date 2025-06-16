
import React from 'react';

interface SubjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SubjectTabs = ({ activeTab, onTabChange }: SubjectTabsProps) => {
  return (
    <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onTabChange('all')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'all'
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        All (6)
      </button>
      <button
        onClick={() => onTabChange('due')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'due'
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Due (6)
      </button>
    </div>
  );
};
