
import React from "react";

export const StreakHeatmap = () => {
  const generateHeatmapData = () => {
    const data = [];
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      data.push({
        date: new Date(currentDate),
        level: Math.floor(Math.random() * 5),
        day: currentDate.getDate(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getLevelClass = (level: number) => {
    const classes = {
      0: "bg-gray-800 text-gray-500",
      1: "bg-blue-300 text-white",
      2: "bg-blue-500 text-white",
      3: "bg-blue-700 text-white",
      4: "bg-blue-800 text-white",
    };
    return classes[level as keyof typeof classes] || "bg-gray-800 text-white";
  };

  const getWeekIndex = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const offset = (firstDay.getDay() + 6) % 7; // Ensure weeks start on Sunday
    const dayOfYear = Math.floor((date.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor((dayOfYear + offset) / 7);
  };

  const getGridData = () => {
    const grid = Array.from({ length: 53 }, () => Array(7).fill(null));
    heatmapData.forEach((day) => {
      const week = getWeekIndex(day.date);
      const dayOfWeek = day.date.getDay();
      if (week < 53 && dayOfWeek < 7) {
        grid[week][dayOfWeek] = day;
      }
    });
    return grid;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthPositions: { [key: number]: number } = {};
  heatmapData.forEach((day) => {
    const month = day.date.getMonth();
    const week = getWeekIndex(day.date);
    if (!(month in monthPositions)) {
      monthPositions[month] = week;
    }
  });

  const grid = getGridData();

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <div className="bg-[#1a1a1d] rounded-xl p-4">
        <h2 className="text-2xl font-bold text-white mb-4">2025 Study Calendar</h2>
        <div className="flex gap-1 mb-2 ml-[60px]">
          {months.map((month, index) => (
            <div
              key={month}
              className="text-sm text-gray-400 text-center"
              style={{
                minWidth: "15px",
                marginLeft:
                  index === 0
                    ? `${(monthPositions[index] ?? 0) * 16}px`
                    : `${((monthPositions[index] ?? 0) - (monthPositions[index - 1] ?? 0)) * 16}px`,
              }}
            >
              {month}
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="flex flex-col gap-1 mr-2 text-xs text-gray-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} style={{ height: "16px" }}>{d}</div>
            ))}
          </div>
          <div className="flex gap-[2px]">
            {grid.map((week, i) => (
              <div key={i} className="flex flex-col gap-[2px]">
                {week.map((day, j) => (
                  <div
                    key={j}
                    className={`w-5 h-5 text-[10px] leading-[16px] text-center rounded-sm ${day ? getLevelClass(day.level) : ""}`}
                    title={day ? day.date.toDateString() : ""}
                  >
                    {day ? day.day : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          Consistency is key to success. Keep building your streak! 🔥
        </div>
      </div>
    </div>
  );
};
