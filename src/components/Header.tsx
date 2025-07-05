import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Calendar, Settings, Share } from 'lucide-react';
import { ExamDropdown } from './ExamDropdown';

interface Exam {
  id: number;
  name: string;
}

interface HeaderProps {
  selectedExamId?: number | null;
  onExamChange?: (examId: number) => void;
}

export const Header = ({ selectedExamId, onExamChange }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(() => {
    const saved = localStorage.getItem('selectedExamId');
    const name = localStorage.getItem('selectedExamName');
    return saved && name ? { id: parseInt(saved), name } : null;
  });

  const handleCalendarClick = () => {
    if (location.pathname === '/timetable') {
      navigate('/');
    } else {
      navigate('/timetable');
    }
  };

  const handleSettingsClick = () => {
    if (location.pathname === '/settings') {
      navigate('/');
    } else {
      navigate('/settings');
    }
  };

  const handleExamSelect = (exam: Exam) => {
    setSelectedExam(exam);
    localStorage.setItem('selectedExamId', exam.id.toString());
    localStorage.setItem('selectedExamName', exam.name);
    onExamChange?.(exam.id);
    // You can add additional logic here like:
    // - Updating global state
    // - Making API calls to update user preferences
    // - Triggering other components to refresh
    console.log('Selected exam:', exam);
  };

  return (
    <div className="bg-slate-900 px-6 py-5 border-b border-slate-700 min-h-[72px] flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            variant="default"
            size="md"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleCalendarClick}>
            <Calendar className={`w-5 h-5 cursor-pointer transition-colors ${
              location.pathname === '/timetable' 
                ? 'text-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`} />
          </button>
          <button onClick={handleSettingsClick}>
            <Settings className={`w-5 h-5 cursor-pointer transition-colors ${
              location.pathname === '/settings' 
                ? 'text-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`} />
          </button>
          <Share className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
};
