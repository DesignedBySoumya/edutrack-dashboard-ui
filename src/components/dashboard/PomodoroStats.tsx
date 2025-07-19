import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, Play, BookOpen } from "lucide-react";

const sessionData = [
  { type: "Focus", count: 28, color: "#a3a3a3" },
  { type: "Short Break", count: 24, color: "#52525b" },
  { type: "Long Break", count: 6, color: "#27272a" },
];

const subjectTimeData = [
  { subject: "Polity", minutes: 420 },
  { subject: "History", minutes: 360 },
  { subject: "Geography", minutes: 280 },
  { subject: "Economics", minutes: 240 },
];

export const PomodoroStats = () => {
  const totalSessions = sessionData.reduce((sum, item) => sum + item.count, 0);
  const totalMinutes = subjectTimeData.reduce((sum, item) => sum + item.minutes, 0);
  const focusRatio = Math.round((sessionData[0].count / totalSessions) * 100);

  return (
    <Card className="bg-[#181B23] rounded-2xl shadow p-6 font-inter text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Clock className="h-5 w-5 text-gray-300" />
          <span>Pomodoro Sessions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">{totalSessions}</div>
            <div className="text-xs text-gray-400">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">{focusRatio}%</div>
            <div className="text-xs text-gray-400">Focus Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">{Math.round(totalMinutes / 60)}h</div>
            <div className="text-xs text-gray-400">Total Time</div>
          </div>
        </div>

        {/* Session Types */}
        <div>
          <h4 className="font-medium mb-3 flex items-center text-gray-200">
            <Play className="h-4 w-4 mr-2 text-gray-300" />
            Session Types
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="count"
                  >
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {sessionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-200">{item.type}</span>
                  </div>
                  <span className="font-medium text-gray-100">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Time */}
        <div>
          <h4 className="font-medium mb-3 flex items-center text-gray-200">
            <BookOpen className="h-4 w-4 mr-2 text-gray-300" />
            Time by Subject
          </h4>
          <div className="space-y-2">
            {subjectTimeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-200">{item.subject}</span>
                <div className="text-right">
                  <span className="font-medium text-gray-100">{Math.round(item.minutes / 60)}h {item.minutes % 60}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Session */}
        <div className="p-4 bg-zinc-900 rounded-xl">
          <div className="text-sm text-gray-400">Last Session</div>
          <div className="font-medium text-gray-100">Modern History - 25 minutes</div>
          <div className="text-xs text-gray-400">2 hours ago</div>
        </div>
      </CardContent>
    </Card>
  );
} 