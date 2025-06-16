
import React from 'react';

interface SubjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SubjectTabs = ({ activeTab, onTabChange }: SubjectTabsProps) => {
  return (
    <div className="bg-gray-900 px-4 pb-4">
      <div className="flex space-x-2">
        <button
          onClick={() => onTabChange('all')}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          All (6)
        </button>
        <button
          onClick={() => onTabChange('due')}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'due'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Due (6)
        </button>
      </div>
    </div>
  );
};
