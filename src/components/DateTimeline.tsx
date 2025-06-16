
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
    <div className="bg-gray-900 px-4 py-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {dates.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              onClick={() => onDateSelect(item.date)}
              className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all min-w-[45px] ${
                selectedDate === item.date
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <span className="text-xs mb-1">{item.day}</span>
              <span className="text-lg font-bold">{item.date}</span>
              <span className="text-xs mt-1">{item.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
