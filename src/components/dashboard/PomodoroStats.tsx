import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, Play, BookOpen } from "lucide-react";
import { DashboardStats } from "@/lib/dashboardService";

interface PomodoroStatsProps {
  stats: DashboardStats;
}

export const PomodoroStats = ({ stats }: PomodoroStatsProps) => {
  const pomodoroStats = stats.pomodoroStats;
  const sessionData = pomodoroStats.sessionTypes;
  const subjectTimeData = pomodoroStats.subjectTime;
  
  const totalSessions = sessionData.reduce((sum, item) => sum + item.count, 0);
  const totalMinutes = subjectTimeData.reduce((sum, item) => sum + item.minutes, 0);
  const focusRatio = pomodoroStats.focusRatio;

  // Custom tooltip for session types pie chart (matching subject breakdown design)
  const SessionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="tooltip">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-300">{data.value} sessions ({((data.value / totalSessions) * 100).toFixed(1)}%)</p>
        </div>
      );
    } 
    return null;
  };

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
            <div className="text-2xl font-bold text-primary">{totalSessions}</div>
            <div className="text-xs text-muted-foreground">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{focusRatio}%</div>
            <div className="text-xs text-muted-foreground">Focus Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{pomodoroStats.totalTime}h</div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
        </div>

        {/* Session Types */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Play className="h-4 w-4 mr-2" />
            Session Types
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {sessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<SessionTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {sessionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300">{item.type}</span>
                  </div>
                  <div className="text-white font-medium">
                    {item.count} ({((item.count / totalSessions) * 100).toFixed(0)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Time */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Time by Subject
          </h4>
          <div className="space-y-2">
            {subjectTimeData.length > 0 ? (
              subjectTimeData.map((item, index) => {
                const hours = Math.floor(item.minutes / 60);
                const minutes = item.minutes % 60;
                const timeDisplay = hours > 0 
                  ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
                  : `${minutes}m`;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.subject}</span>
                    <div className="text-right">
                      <span className="font-medium">{timeDisplay}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-4">
                No subject data available
              </div>
            )}
          </div>
        </div>

        {/* Last Session */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Last Session</div>
          <div className="font-medium">
            {subjectTimeData.length > 0 
              ? `${subjectTimeData[0].subject} - ${Math.floor(subjectTimeData[0].minutes / 60)}h ${subjectTimeData[0].minutes % 60}m`
              : 'No recent sessions'
            }
          </div>
          <div className="text-xs text-muted-foreground">2 hours ago</div>
        </div>
      </CardContent>
    </Card>
  );
} 