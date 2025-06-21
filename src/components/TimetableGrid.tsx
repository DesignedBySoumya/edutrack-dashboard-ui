
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

  const getCurrentDate = () => {
    const today = new Date();
    const currentDay = today.getDay();
    return currentDay === 0 ? 6 : currentDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const hasTimeBlock = (day: string, time: string) => {
    return timeBlocks.find(block => 
      block.day.toLowerCase() === day.toLowerCase() && 
      block.startTime === time
    );
  };

  const currentDayIndex = getCurrentDate();

  return (
    <div className="bg-[#1a1a1f] rounded-xl border border-slate-800 p-4 overflow-x-auto">
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
              {new Date().getDate() + (index - currentDayIndex)}
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
              const timeBlock = hasTimeBlock(day, time);
              return (
                <div
                  key={`${day}-${time}`}
                  className="h-8 border border-slate-700 rounded cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-center relative"
                  onClick={() => onCellClick?.(day, time)}
                >
                  {timeBlock && (
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: timeBlock.color }}
                      title={`${timeBlock.category} - ${timeBlock.startTime} to ${timeBlock.endTime}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
