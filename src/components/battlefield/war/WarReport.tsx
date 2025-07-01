
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, BookOpen, Award } from 'lucide-react';

interface WarReportProps {
  onNewBattle: () => void;
}

const WarReport = ({ onNewBattle }: WarReportProps) => {
  // Mock detailed analytics data
  const subjectData = [
    { name: 'Polity', correct: 8, incorrect: 2, accuracy: 80 },
    { name: 'Geography', correct: 12, incorrect: 3, accuracy: 80 },
    { name: 'Economy', correct: 7, incorrect: 8, accuracy: 47 },
    { name: 'History', correct: 5, incorrect: 5, accuracy: 50 },
  ];

  const pieData = [
    { name: 'Correct', value: 32, color: '#10b981' },
    { name: 'Incorrect', value: 18, color: '#ef4444' },
  ];

  const timeData = [
    { subject: 'Polity', time: 12 },
    { subject: 'Geography', time: 15 },
    { subject: 'Economy', time: 10 },
    { subject: 'History', time: 8 },
  ];

  const battleHistory = [
    { date: '2024-01-15', score: 85, accuracy: 85 },
    { date: '2024-01-10', score: 78, accuracy: 78 },
    { date: '2024-01-05', score: 64, accuracy: 64 },
    { date: '2024-01-01', score: 72, accuracy: 72 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-indigo-400 mb-2">War Analytics Dashboard</h1>
          <p className="text-gray-300">Deep dive into your battle performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400 mb-1">64%</div>
              <div className="text-sm text-gray-400">Overall Accuracy</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-400 mb-1">45m</div>
              <div className="text-sm text-gray-400">Total Time</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400 mb-1">50</div>
              <div className="text-sm text-gray-400">Questions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-400 mb-1">+12%</div>
              <div className="text-sm text-gray-400">Improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Subject Performance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
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
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Answer Distribution</CardTitle>
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

        {/* Time Analysis */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Time Spent per Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="time" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Battle History */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Recent Battle History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400">Score</th>
                    <th className="text-left py-3 px-4 text-gray-400">Accuracy</th>
                    <th className="text-left py-3 px-4 text-gray-400">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {battleHistory.map((battle, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">{battle.date}</td>
                      <td className="py-3 px-4 text-white font-semibold">{battle.score}%</td>
                      <td className="py-3 px-4 text-white">{battle.accuracy}%</td>
                      <td className="py-3 px-4">
                        {index === 0 ? (
                          <span className="text-green-400">↗ Improving</span>
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Start New Battle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarReport;
