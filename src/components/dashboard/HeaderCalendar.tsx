
import React, { useState } from 'react';

export const HeaderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('19');
  
  // Generate calendar data
  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 10);
    
    for (let i = 0; i < 21; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date.getDate().toString(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        hours: Math.random() > 0.3 ? (Math.random() * 8).toFixed(1) : '0.0',
        isToday: i === 10
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-4">
      {/* Desktop: 21 days */}
      <div className="hidden lg:flex justify-center gap-2">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day.date)}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all min-w-[48px] ${
              selectedDate === day.date || day.isToday
                ? 'bg-blue-500 text-white'
                : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            <span className="text-sm font-semibold">{day.date}</span>
            <span className="text-xs mt-1">{day.hours}h</span>
          </button>
        ))}
      </div>

      {/* Tablet: 14 days */}
      <div className="hidden sm:flex lg:hidden justify-center gap-2">
        {calendarDays.slice(3, 17).map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day.date)}
            className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all min-w-[44px] ${
              selectedDate === day.date || day.isToday
                ? 'bg-blue-500 text-white'
                : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            <span className="text-sm font-semibold">{day.date}</span>
            <span className="text-xs mt-1">{day.hours}h</span>
          </button>
        ))}
      </div>

      {/* Mobile: 7 days */}
      <div className="flex sm:hidden justify-center gap-1">
        {calendarDays.slice(7, 14).map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day.date)}
            className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all min-w-[40px] flex-shrink-0 ${
              selectedDate === day.date || day.isToday
                ? 'bg-blue-500 text-white'
                : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            <span className="text-sm font-semibold">{day.date}</span>
            <span className="text-xs mt-1">{day.hours}h</span>
          </button>
        ))}
      </div>
    </div>
  );
};
