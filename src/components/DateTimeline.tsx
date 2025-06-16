
import React from 'react';

interface DateTimelineProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const DateTimeline = ({ selectedDate, onDateSelect }: DateTimelineProps) => {
  const dates = [
    { date: '29', day: 'Wed', time: '0:00' },
    { date: '30', day: 'Thu', time: '0:00' },
    { date: '1', day: 'Fri', time: '0:00' },
    { date: '2', day: 'Sat', time: '16:51' },
    { date: '3', day: 'Sun', time: '0:00' },
    { date: '4', day: 'Mon', time: '0:00' },
    { date: '5', day: 'Tue', time: '0:00' },
  ];

  return (
    <div className="flex-1 mr-4">
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">May - Jun 2024</span>
        </div>
        <div className="flex justify-between space-x-2">
          {dates.map((item) => (
            <button
              key={item.date}
              onClick={() => onDateSelect(item.date)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                selectedDate === item.date
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span className="text-xs text-gray-400 mb-1">{item.day}</span>
              <span className="text-lg font-semibold">{item.date}</span>
              <span className="text-xs mt-1">{item.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
