
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TimetableGrid } from '@/components/TimetableGrid';
import { AddTimetableModal } from '@/components/AddTimetableModal';
import { FloatingButton } from '@/components/FloatingButton';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface TimeBlock {
  id: string;
  date: string; // e.g. "2025-07-01" - ISO date format
  startTime: string;
  endTime: string;
  category: string;
  color: string;
}

interface ScheduleData {
  category: string;
  dates: string[]; // Array of ISO date strings
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
  const [loading, setLoading] = useState(true);

  // Get current week dates (Monday to Sunday)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    
    let daysToSubtract;
    if (currentDay === 0) { // Sunday
      daysToSubtract = 6;
    } else {
      daysToSubtract = currentDay - 1;
    }
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToSubtract);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    
    return weekDates;
  };

  // Load time blocks from Supabase for current week
  const loadTimeBlocks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        setTimeBlocks([]);
        return;
      }

      const weekDates = getCurrentWeekDates();
      console.log('Loading time blocks for week:', weekDates);

      const { data, error } = await supabase
        .from('timetable_blocks')
        .select('*')
        .eq('user_id', user.id)
        .in('date', weekDates)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error loading time blocks:', error);
        setTimeBlocks([]);
        return;
      }

      // Transform Supabase data to TimeBlock format
      const blocks: TimeBlock[] = (data || []).map(block => ({
        id: block.id,
        date: block.date,
        startTime: formatTimeFrom24Hour(block.start_time),
        endTime: formatTimeFrom24Hour(block.end_time),
        category: block.category,
        color: block.color || categoryColors[block.category] || '#3b82f6'
      }));

      console.log('Loaded time blocks:', blocks);
      setTimeBlocks(blocks);
    } catch (error) {
      console.error('Error in loadTimeBlocks:', error);
      setTimeBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadTimeBlocks();
  }, []);

  const handleSaveSchedule = async (scheduleData: ScheduleData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      const newBlocks = [];
      
      for (const date of scheduleData.dates) {
        const newBlock = {
          user_id: user.id,
          date: date,
          start_time: convertTo24Hour(scheduleData.startTime),
          end_time: convertTo24Hour(scheduleData.endTime),
          category: scheduleData.category,
          color: categoryColors[scheduleData.category] || '#3b82f6',
          notifications: scheduleData.notifications
        };
        
        newBlocks.push(newBlock);
      }

      const { data, error } = await supabase
        .from('timetable_blocks')
        .insert(newBlocks)
        .select();

      if (error) {
        console.error('Error saving time blocks:', error);
        return;
      }

      console.log('Successfully saved time blocks:', data);
      
      // Reload time blocks to show new data
      await loadTimeBlocks();

      if (scheduleData.notifications) {
        console.log('Notifications enabled for:', scheduleData.category);
      }
    } catch (error) {
      console.error('Error in handleSaveSchedule:', error);
    }
  };

  const formatTimeFrom24Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (time12: string) => {
    const [time, ampm] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleCellClick = (date: string, time: string) => {
    console.log(`Clicked cell: ${date} at ${time}`);
    // You can open a modal here to add a new block for this specific date and time
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] text-white pb-20">
        <Header />
        <div className="px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading timetable...</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

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
