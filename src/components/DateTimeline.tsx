
import React from 'react';

interface DateTimelineProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const DateTimeline = ({ selectedDate, onDateSelect }: DateTimelineProps) => {
  // Generate dynamic dates centered on today
  const generateDates = () => {
    const today = new Date();
    const dates = [];

    // Generate 50 days before today (more than we need for any breakpoint)
    for (let i = 50; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push({
        fullDate: date.toDateString(),
        date: date.getDate().toString(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }

    // Add today (center)
    dates.push({
      fullDate: today.toDateString(),
      date: today.getDate().toString(),
      day: today.toLocaleDateString('en-US', { weekday: 'short' }),
      month: today.toLocaleDateString('en-US', { month: 'short' }),
    });

    // Generate 50 days after today (more than we need for any breakpoint)
    for (let i = 1; i <= 50; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        fullDate: date.toDateString(),
        date: date.getDate().toString(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }

    return dates;
  };

  const allDates = generateDates();
  const todayIndex = 50; // Today is at index 50 (center of 101 dates)

  // Get visible dates based on screen size
  const getVisibleDates = () => {
    const width = window.innerWidth;
    
    if (width < 768) {
      // Mobile: 7 days (3 before, today, 3 after)
      const startIndex = todayIndex - 3;
      const endIndex = todayIndex + 3;
      return allDates.slice(startIndex, endIndex + 1);
    } else if (width < 1200) {
      // Tablet: 18 days (8 before, today, 9 after)
      const startIndex = todayIndex - 8;
      const endIndex = todayIndex + 9;
      return allDates.slice(startIndex, endIndex + 1);
    } else {
      // Desktop: 22 days (10 before, today, 11 after)
      const startIndex = todayIndex - 10;
      const endIndex = todayIndex + 11;
      return allDates.slice(startIndex, endIndex + 1);
    }
  };

  const [visibleDates, setVisibleDates] = React.useState(getVisibleDates());

  // Update visible dates on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setVisibleDates(getVisibleDates());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex gap-2 w-full justify-between">
        {visibleDates.map((item, index) => (
          <button
            key={`${item.day}-${item.date}-${index}`}
            onClick={() => onDateSelect(item.fullDate)}
            className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all font-inter text-xs min-w-0 flex-1 ${
              item.fullDate === new Date().toDateString() || selectedDate === item.fullDate
                ? 'bg-blue-500 text-white brightness-110'
                : 'hover:bg-slate-800 text-gray-400'
            }`}
          >
            <span className="font-medium mb-1">{item.month}</span>
            <span className="text-sm font-semibold">{item.date}</span>
            <span className="mt-1">00:00</span>
          </button>
        ))}
      </div>
    </div>
  );
};
