
import React from 'react';

interface TimeBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
}

interface TimetableGridProps {
  timeBlocks: TimeBlock[];
  onCellClick?: (day: string, time: string) => void;
}

export const TimetableGrid = ({ timeBlocks, onCellClick }: TimetableGridProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = [
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', 
    '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
  ];

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    
    // Calculate days to subtract to get to Monday (1 = Monday, 0 = Sunday)
    let daysToSubtract;
    if (currentDay === 0) { // Sunday
      daysToSubtract = 6; // Go back 6 days to get to Monday
    } else {
      daysToSubtract = currentDay - 1; // Go back (currentDay - 1) days to get to Monday
    }
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToSubtract);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    // Debug logging
    console.log('Today:', today.toDateString());
    console.log('Current day of week:', currentDay);
    console.log('Days to subtract:', daysToSubtract);
    console.log('Monday:', monday.toDateString());
    console.log('Week dates:', weekDates.map(d => d.toDateString()));
    
    return weekDates;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const weekDates = getWeekDates();
    const todayString = today.toDateString();
    
    return weekDates.findIndex(date => date.toDateString() === todayString);
  };

  const getTimeBlocksForCell = (day: string, time: string) => {
    return timeBlocks.filter(block => 
      block.day.toLowerCase() === day.toLowerCase() && 
      block.startTime === time
    );
  };

  const weekDates = getWeekDates();
  const currentDayIndex = getCurrentDate();
  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long' });
  const currentYear = today.getFullYear();

  // Debug logging for render values
  console.log('Current day index:', currentDayIndex);
  console.log('Current month:', currentMonth);
  console.log('Current year:', currentYear);
  console.log('Week dates for display:', weekDates.map(d => d.getDate()));

  return (
    <div className="bg-[#1a1a1f] rounded-xl border border-slate-800 p-4 overflow-x-auto">
      {/* Month and Year Header */}
      <div className="text-center mb-4">
        <div className="text-lg font-semibold text-white">
          📅 {currentMonth} {currentYear}
        </div>
      </div>

      {/* Header with days */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="text-xs text-gray-400 font-medium p-2"></div>
        {days.map((day, index) => (
          <div key={day} className="text-center p-2">
            <div className={`text-xs font-medium mb-1 ${
              index === currentDayIndex ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {day}
            </div>
            <div className={`text-sm ${
              index === currentDayIndex 
                ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' 
                : 'text-white'
            }`}>
              {weekDates[index].getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots grid */}
      <div className="space-y-1">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 gap-2 items-center">
            <div className="text-xs text-gray-400 text-right pr-2">
              {time}
            </div>
            {days.map((day) => {
              const cellBlocks = getTimeBlocksForCell(day, time);
              return (
                <div
                  key={`${day}-${time}`}
                  className="h-12 border border-slate-700 rounded cursor-pointer hover:bg-slate-800 transition-colors flex flex-col items-center justify-center p-1 relative"
                  onClick={() => onCellClick?.(day, time)}
                >
                  {cellBlocks.map((block, index) => (
                    <div 
                      key={block.id}
                      className="w-full bg-[#2a2a2f] rounded-md px-2 py-1 mb-1 text-xs text-white flex items-center justify-center"
                      style={{ backgroundColor: `${block.color}20`, borderLeft: `3px solid ${block.color}` }}
                      title={`${block.category} - ${block.startTime} to ${block.endTime}`}
                    >
                      <span className="truncate">📖 {block.category.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
