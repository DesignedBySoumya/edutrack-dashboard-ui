
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, Settings, Share, BookOpen } from 'lucide-react';

interface HeaderProps {
  selectedExam: string;
  examOptions: string[];
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onExamChange: (exam: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedExam,
  examOptions,
  isDropdownOpen,
  onDropdownToggle,
  onExamChange
}) => {
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
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={onDropdownToggle}
            className="flex items-center space-x-2 bg-blue-500 hover:brightness-110 px-4 py-2 rounded-lg transition-all"
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{selectedExam}</span>
            <ChevronDown 
              className={`w-4 h-4 text-white transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[200px]">
              {examOptions.map((exam) => (
                <button
                  key={exam}
                  onClick={() => onExamChange(exam)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150 border-b border-slate-700 last:border-b-0 ${
                    exam === selectedExam 
                      ? 'bg-blue-500 bg-opacity-20 text-blue-400' 
                      : 'text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className={`w-4 h-4 ${
                      exam === selectedExam ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                    <span className="font-medium text-sm">{exam}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
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
