
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
  ];

  return (
    <div className="bg-slate-900 px-6 py-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {dates.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              onClick={() => onDateSelect(item.date)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all min-w-[60px] font-inter ${
                selectedDate === item.date
                  ? 'bg-blue-500 text-white brightness-110'
                  : 'hover:bg-slate-800 text-gray-400'
              }`}
            >
              <span className="text-xs font-medium mb-1">{item.day}</span>
              <span className="text-lg font-semibold">{item.date}</span>
              <span className="text-xs mt-1">{item.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
