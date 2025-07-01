
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, BookOpen, Award } from 'lucide-react';
import { useBattleSessions } from '@/hooks/useBattleSessions';

interface WarReportProps {
  onNewBattle: () => void;
}

const WarReport = ({ onNewBattle }: WarReportProps) => {
  const { data: battleSessions, isLoading } = useBattleSessions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6 flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading war analytics...</div>
      </div>
    );
  }

  if (!battleSessions || battleSessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-400 mb-2">War Analytics Dashboard</h1>
            <p className="text-gray-300 mb-8">Complete battles to see your analytics</p>
            <Button
              onClick={onNewBattle}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
            >
              Start Your First Battle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get the latest battle for current metrics
  const latestBattle = battleSessions[0];
  
  // Calculate overall accuracy
  const overallAccuracy = latestBattle.total_questions > 0 
    ? Math.round((latestBattle.correct_answers / latestBattle.total_questions) * 100)
    : 0;

  // Process subjects data from the latest battle
  const subjectsData = latestBattle.subjects_data || {};
  const subjectPerformance = Object.entries(subjectsData).map(([name, data]: [string, any]) => ({
    name: name.replace('Indian ', '').replace(' and World', ''),
    correct: data.correct || 0,
    incorrect: data.incorrect || 0,
    accuracy: data.correct && data.incorrect ? Math.round((data.correct / (data.correct + data.incorrect)) * 100) : 0
  }));

  // Create pie chart data
  const pieData = [
    { name: 'Correct', value: latestBattle.correct_answers, color: '#10b981' },
    { name: 'Incorrect', value: latestBattle.incorrect_answers, color: '#ef4444' },
  ];

  // Create time data (mock for now, can be enhanced later)
  const timeData = subjectPerformance.map(subject => ({
    subject: subject.name,
    time: Math.floor(Math.random() * 15) + 5 // Mock time data
  }));

  // Process battle history
  const battleHistory = battleSessions.slice(0, 4).map((battle, index) => ({
    date: new Date(battle.created_at).toLocaleDateString(),
    score: battle.total_marks,
    accuracy: battle.total_questions > 0 
      ? Math.round((battle.correct_answers / battle.total_questions) * 100)
      : 0,
    isLatest: index === 0
  }));

  // Calculate improvement
  const improvement = battleHistory.length > 1 
    ? battleHistory[0].accuracy - battleHistory[1].accuracy 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">War Analytics Dashboard</h1>
          <p className="text-gray-300">Deep dive into your battle performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-400">{overallAccuracy}%</div>
              <div className="text-sm text-gray-400">Overall Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400">{Math.floor(latestBattle.time_spent / 60)}m</div>
              <div className="text-sm text-gray-400">Total Time</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400">{latestBattle.total_questions}</div>
              <div className="text-sm text-gray-400">Questions</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {improvement > 0 ? '+' : ''}{improvement}%
              </div>
              <div className="text-sm text-gray-400">Improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subject Performance */}
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-orange-400">Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="correct" fill="#10b981" />
                  <Bar dataKey="incorrect" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Correct vs Incorrect */}
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-orange-400">Answer Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Battle History */}
        <Card className="bg-slate-800/50 border-orange-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-orange-400">Recent Battle History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="py-2 text-gray-300">Date</th>
                    <th className="py-2 text-gray-300">Score</th>
                    <th className="py-2 text-gray-300">Accuracy</th>
                    <th className="py-2 text-gray-300">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {battleHistory.map((battle, index) => (
                    <tr key={index} className="border-b border-slate-700">
                      <td className="py-2 text-gray-200">{battle.date}</td>
                      <td className="py-2 text-gray-200">{battle.score}</td>
                      <td className="py-2 text-gray-200">{battle.accuracy}%</td>
                      <td className="py-2">
                        {battle.isLatest ? (
                          <span className="text-green-400 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Latest
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={onNewBattle}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
          >
            Start New Battle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarReport;
