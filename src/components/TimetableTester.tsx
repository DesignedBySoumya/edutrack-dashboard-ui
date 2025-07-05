import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimetableGrid } from '@/components/TimetableGrid';
import { AddTimetableModal } from '@/components/AddTimetableModal';
import { supabase } from '@/lib/supabaseClient';

interface TimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
}

const TimetableTester = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get current week dates
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

  const loadTimeBlocks = async () => {
    setLoading(true);
    try {
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
        color: block.color || '#3b82f6'
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

  const formatTimeFrom24Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSaveSchedule = async (scheduleData: any) => {
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
          color: '#3b82f6',
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
    } catch (error) {
      console.error('Error in handleSaveSchedule:', error);
    }
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
  };

  useEffect(() => {
    loadTimeBlocks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-[#1C2541] border-[#2563EB]/20">
        <CardHeader>
          <CardTitle className="text-white">Timetable System Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={loadTimeBlocks} 
              disabled={loading}
              className="bg-[#2563EB] hover:bg-[#1E3A8A]"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="outline"
              className="border-[#2563EB]/30 text-white"
            >
              Add Schedule
            </Button>
          </div>
          
          <div className="text-sm text-[#93A5CF]">
            <p>Current week dates: {getCurrentWeekDates().join(', ')}</p>
            <p>Loaded {timeBlocks.length} time blocks</p>
          </div>
        </CardContent>
      </Card>

      <TimetableGrid 
        timeBlocks={timeBlocks}
        onCellClick={handleCellClick}
      />

      <AddTimetableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
      />
    </div>
  );
};

export default TimetableTester; 