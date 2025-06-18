
import React from 'react';

interface DateTimelineProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const DateTimeline = ({ selectedDate, onDateSelect }: DateTimelineProps) => {
  const dates = [
    { date: '29', day: 'May', time: '6:30' },
    { date: '30', day: 'May', time: '0:00' },
    { date: '31', day: 'May', time: '0:00' },
    { date: '1', day: 'Jun', time: '0:00' },
    { date: '2', day: 'Jun', time: '0:00' },
    { date: '3', day: 'Jun', time: '0:00' },
    { date: '4', day: 'Jun', time: '0:00' },
    { date: '5', day: 'Jun', time: '0:00' },
    { date: '6', day: 'Jun', time: '0:00' },
    { date: '7', day: 'Jun', time: '0:00' },
    { date: '8', day: 'Jun', time: '0:00' },
    { date: '9', day: 'Jun', time: '0:00' },
    { date: '10', day: 'Jun', time: '0:00' },
    { date: '11', day: 'Jun', time: '0:00' },
    { date: '12', day: 'Jun', time: '0:00' },
    { date: '13', day: 'Jun', time: '0:00' },
    { date: '14', day: 'Jun', time: '0:00' },
    { date: '15', day: 'Jun', time: '0:00' },
    { date: '16', day: 'Jun', time: '0:00' },
    { date: '17', day: 'Jun', time: '0:00' },
    { date: '18', day: 'Jun', time: '0:00' },
    { date: '19', day: 'Jun', time: '0:00' },
  ];

  // Show 7 days on mobile, 22 on desktop
  const visibleDates = dates.slice(0, 22);
  const mobileDates = dates.slice(0, 7);

  return (
    <div className="bg-slate-900 px-6 py-4">
      {/* Desktop view - 22 days */}
      <div className="hidden md:block">
        <div className="grid grid-cols-22 gap-1 w-full">
          {visibleDates.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              onClick={() => onDateSelect(item.date)}
              className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all font-inter text-xs ${
                selectedDate === item.date
                  ? 'bg-blue-500 text-white brightness-110'
                  : 'hover:bg-slate-800 text-gray-400'
              }`}
            >
              <span className="font-medium mb-1">{item.day}</span>
              <span className="text-sm font-semibold">{item.date}</span>
              <span className="mt-1">{item.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile view - 7 days */}
      <div className="block md:hidden">
        <div className="grid grid-cols-7 gap-1 w-full">
          {mobileDates.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              onClick={() => onDateSelect(item.date)}
              className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all font-inter text-xs ${
                selectedDate === item.date
                  ? 'bg-blue-500 text-white brightness-110'
                  : 'hover:bg-slate-800 text-gray-400'
              }`}
            >
              <span className="font-medium mb-1">{item.day}</span>
              <span className="text-sm font-semibold">{item.date}</span>
              <span className="mt-1">{item.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
