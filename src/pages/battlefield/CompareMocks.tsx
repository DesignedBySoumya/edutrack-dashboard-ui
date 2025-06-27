
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const CompareMocks = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('score');

  // Mock data for previous tests
  const mockData = [
    { mock: 'Mock 1', score: 42, accuracy: 65, rank: 1500, percentile: 68, date: '2024-06-01' },
    { mock: 'Mock 2', score: 38, accuracy: 58, rank: 1800, percentile: 62, date: '2024-06-08' },
    { mock: 'Mock 3', score: 48, accuracy: 72, rank: 1200, percentile: 75, date: '2024-06-15' },
    { mock: 'Mock 4', score: 52, accuracy: 78, rank: 980, percentile: 82, date: '2024-06-22' },
    { mock: 'Current', score: 55, accuracy: 80, rank: 850, percentile: 85, date: '2024-06-25' }
  ];

  // Subject comparison data
  const subjectData = [
    { subject: 'Mathematics', mock1: 12, mock2: 10, mock3: 15, mock4: 16, current: 18 },
    { subject: 'English', mock1: 11, mock2: 9, mock3: 13, mock4: 14, current: 15 },
    { subject: 'GK/GS', mock1: 8, mock2: 7, mock3: 9, mock4: 11, current: 12 },
    { subject: 'Reasoning', mock1: 11, mock2: 12, mock3: 11, mock4: 11, current: 10 }
  ];

  // Radar chart data for current vs average
  const radarData = [
    { subject: 'Math', current: 90, average: 75, fullMark: 100 },
    { subject: 'English', current: 85, average: 70, fullMark: 100 },
    { subject: 'GK/GS', current: 70, average: 60, fullMark: 100 },
    { subject: 'Reasoning', current: 65, average: 68, fullMark: 100 }
  ];

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/pts-report-card')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Report Card
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Compare Mock Tests</h1>
            <p className="text-gray-600">Track your progress across multiple mock tests</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === 'score' ? 'default' : 'outline'}
            onClick={() => setActiveView('score')}
          >
            Score Over Time
          </Button>
          <Button
            variant={activeView === 'accuracy' ? 'default' : 'outline'}
            onClick={() => setActiveView('accuracy')}
          >
            Accuracy Trends
          </Button>
          <Button
            variant={activeView === 'rank' ? 'default' : 'outline'}
            onClick={() => setActiveView('rank')}
          >
            Rank vs Percentile
          </Button>
          <Button
            variant={activeView === 'subjects' ? 'default' : 'outline'}
            onClick={() => setActiveView('subjects')}
          >
            Subject Comparison
          </Button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {activeView === 'score' && 'Score Progress Over Time'}
                {activeView === 'accuracy' && 'Accuracy Improvement Trends'}
                {activeView === 'rank' && 'Rank vs Percentile Progress'}
                {activeView === 'subjects' && 'Subject-wise Performance Comparison'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {activeView === 'score' ? (
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mock" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                ) : activeView === 'accuracy' ? (
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mock" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                ) : activeView === 'rank' ? (
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mock" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="rank" stroke="#ff7300" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="percentile" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mock1" fill="#8884d8" />
                    <Bar dataKey="mock2" fill="#82ca9d" />
                    <Bar dataKey="mock3" fill="#ffc658" />
                    <Bar dataKey="mock4" fill="#ff7300" />
                    <Bar dataKey="current" fill="#0088fe" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart for Subject Strengths */}
          <Card>
            <CardHeader>
              <CardTitle>Current vs Average Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Average" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.slice(-2).map((mock, index) => (
                <div key={mock.mock} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{mock.mock}</p>
                    <p className="text-sm text-gray-600">{mock.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{mock.score}</span>
                      {index === 1 && getTrendIcon(mock.score, mockData[mockData.length - 2].score)}
                    </div>
                    <div className={`text-sm ${index === 1 ? getTrendColor(mock.percentile, mockData[mockData.length - 2].percentile) : 'text-gray-600'}`}>
                      {mock.percentile}%ile
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Mock Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Mock Test</th>
                    <th className="text-center p-2">Date</th>
                    <th className="text-center p-2">Score</th>
                    <th className="text-center p-2">Accuracy</th>
                    <th className="text-center p-2">Rank</th>
                    <th className="text-center p-2">Percentile</th>
                    <th className="text-center p-2">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((mock, index) => (
                    <tr key={mock.mock} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{mock.mock}</td>
                      <td className="p-2 text-center">{mock.date}</td>
                      <td className="p-2 text-center font-bold">{mock.score}</td>
                      <td className="p-2 text-center">{mock.accuracy}%</td>
                      <td className="p-2 text-center">{mock.rank}</td>
                      <td className="p-2 text-center">{mock.percentile}%</td>
                      <td className="p-2 text-center">
                        {index > 0 && (
                          <Badge 
                            variant={mock.score > mockData[index - 1].score ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {mock.score > mockData[index - 1].score ? '+' : ''}{mock.score - mockData[index - 1].score}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompareMocks;
