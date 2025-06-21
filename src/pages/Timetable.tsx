
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TimetableGrid } from '@/components/TimetableGrid';
import { AddTimetableModal } from '@/components/AddTimetableModal';
import { FloatingButton } from '@/components/FloatingButton';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';

interface TimeBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
}

interface ScheduleData {
  category: string;
  days: string[];
  startTime: string;
  endTime: string;
  notifications: boolean;
}

const categoryColors: { [key: string]: string } = {
  'Indian Polity and Governance': '#3b82f6',
  'Indian and World Geography': '#10b981',
  'Indian Economy': '#8b5cf6',
  'General Studies': '#f59e0b',
  'Essay Writing': '#ef4444',
  'Current Affairs': '#06b6d4',
};

const TimetablePage = () => {
  const navigate = useNavigate();
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTimeBlocks = localStorage.getItem('timetable');
    if (savedTimeBlocks) {
      try {
        setTimeBlocks(JSON.parse(savedTimeBlocks));
      } catch (error) {
        console.error('Failed to parse saved timetable data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever timeBlocks changes
  useEffect(() => {
    localStorage.setItem('timetable', JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  const handleSaveSchedule = (scheduleData: ScheduleData) => {
    const newTimeBlocks: TimeBlock[] = [];

    scheduleData.days.forEach((day) => {
      const dayShort = day.substring(0, 3);
      const newBlock: TimeBlock = {
        id: `${Date.now()}-${day}`,
        day: dayShort,
        startTime: formatTime(scheduleData.startTime),
        endTime: formatTime(scheduleData.endTime),
        category: scheduleData.category,
        color: categoryColors[scheduleData.category] || '#3b82f6'
      };
      newTimeBlocks.push(newBlock);
    });

    setTimeBlocks(prev => [...prev, ...newTimeBlocks]);

    if (scheduleData.notifications) {
      console.log('Notifications enabled for:', scheduleData.category);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCellClick = (day: string, time: string) => {
    console.log(`Clicked cell: ${day} at ${time}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white pb-20">
      <Header />
      
      <div className="px-6 py-6">
        {/* Back button and header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Study Timetable</h1>
          <p className="text-gray-400 text-sm">Organize your study schedule and track your progress</p>
        </div>

        <TimetableGrid 
          timeBlocks={timeBlocks}
          onCellClick={handleCellClick}
        />
      </div>

      <FloatingButton onClick={() => setIsModalOpen(true)} />
      
      <AddTimetableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
      />

      <BottomNav />
    </div>
  );
};

export default TimetablePage;
