
export const StreakHeatmap = () => {
  const generateHeatmapData = () => {
    const data = [];
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const totalWeeks = 53;
    for (let week = 0; week < totalWeeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);
        if (currentDate.getFullYear() === startDate.getFullYear()) {
          const level = Math.floor(Math.random() * 5);
          weekData.push({ date: currentDate, level, hours: level * 1.5 + Math.random() * 2 });
        }
      }
      if (weekData.length > 0) data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const totalHours = heatmapData.flat().reduce((sum, day) => sum + day.hours, 0);

  const getLevelClass = (level: number) => {
    const classes = {
      0: "bg-gray-800", 
      1: "bg-blue-300", 
      2: "bg-blue-500", 
      3: "bg-blue-700", 
      4: "bg-blue-800"
    };
    return classes[level as keyof typeof classes] || "bg-gray-800";
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">2025 Study Calendar</h2>
        <p className="text-blue-400 text-base sm:text-lg">{Math.floor(totalHours)}h {Math.floor((totalHours % 1) * 60)}m total</p>
      </div>
      <div className="overflow-x-auto scroll-smooth">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[auto_1fr] gap-x-3">
            <div></div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              {months.map((month) => (<span key={month} className="text-center flex-1">{month}</span>))}
            </div>
            <div className="grid grid-rows-7 gap-[3px] text-xs text-gray-400 text-right pr-2">
              {dayLabels.map((day, i) => (<span key={i} className="h-3 flex items-center">{day}</span>))}
            </div>
            <div className="flex gap-[3px]">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-[3px] flex-shrink-0">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = week[dayIndex];
                    return day ? (
                      <div key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-transform duration-200 hover:scale-125 ${getLevelClass(day.level)}`}
                        title={`${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - ${day.hours.toFixed(1)}h`}
                      />
                    ) : (<div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />);
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">Consistency is key to success. Keep building your streak! 🔥</p>
      </div>
    </div>
  );
};
