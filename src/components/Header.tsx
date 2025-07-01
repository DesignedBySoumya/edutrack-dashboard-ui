import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, Settings, Share } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();

  const handleCalendarClick = () => {
    navigate('/timetable');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="bg-slate-900 px-6 py-5 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-500 hover:brightness-110 px-4 py-2 rounded-lg transition-all">
            <span className="text-sm font-medium text-white">UPSC CSE</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleCalendarClick}>
            <Calendar className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </button>
          <button onClick={handleSettingsClick}>
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </button>
          <Share className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
};
