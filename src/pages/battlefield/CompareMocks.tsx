
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const CompareMocks = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('score');
  const [mocks, setMocks] = useState([]);
  const [selectedMockId, setSelectedMockId] = useState(null);
  const [chapterBreakdown, setChapterBreakdown] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user ID on mount
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    }
    fetchUser();
  }, []);

  // Fetch all mocks for the user
  useEffect(() => {
    if (!currentUserId) return;
    async function fetchMocks() {
      const { data } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: true });
      setMocks(data || []);
      if (data && data.length) setSelectedMockId(data[data.length - 1].id);
    }
    fetchMocks();
  }, [currentUserId]);

  // Fetch chapter breakdown for selected mock
  useEffect(() => {
    if (!selectedMockId) return;
    async function fetchChapters() {
      const { data } = await supabase
        .from('mock_performance_by_chapter')
        .select('*, chapters (name, subject_id)')
        .eq('mock_id', selectedMockId);
      setChapterBreakdown(data || []);
    }
    fetchChapters();
  }, [selectedMockId]);

  // Fetch all chapter performances for the user (across all mocks)
  const [allChapterPerformances, setAllChapterPerformances] = useState([]);
  useEffect(() => {
    if (!currentUserId || !mocks.length) return;
    async function fetchAllChapters() {
      const { data } = await supabase
        .from('mock_performance_by_chapter')
        .select('*, chapters (name, subject_id), mock_id')
        .in('mock_id', mocks.map(m => m.id));
      setAllChapterPerformances(data || []);
    }
    fetchAllChapters();
  }, [currentUserId, mocks]);

  // Prepare data for charts and tables from Supabase
  const mockData = mocks.map((m, idx) => ({
    mock: m.mock_name || `Mock ${idx + 1}`,
    score: m.total_score,
    accuracy: m.accuracy,
    rank: m.rank,
    percentile: m.percentile,
    date: m.created_at,
  }));

  // Subject comparison: group chapterBreakdown by subject
  const subjectMap = {};
  chapterBreakdown.forEach(ch => {
    const subject = ch.chapters?.subject_id ? String(ch.chapters.subject_id) : 'Unknown';
    if (!subjectMap[subject]) subjectMap[subject] = { subject, marks: [] };
    if (typeof ch.marks === 'number') {
      subjectMap[subject].marks.push(ch.marks);
    }
  });
  const subjectData = Object.values(subjectMap).map((s: any) => ({
    subject: s.subject,
    current: Array.isArray(s.marks) && s.marks.length > 0 ? s.marks[s.marks.length - 1] : 0,
    // Optionally add more for previous mocks if needed
  }));

  // Radar chart: current vs average marks per chapter
  const chapterNames = Array.from(
    new Set(allChapterPerformances.map(ch => ch.chapters?.name).filter(Boolean))
  );
  const radarData = chapterNames.map(name => {
    // Current mock's value
    const current = chapterBreakdown.find(ch => ch.chapters?.name === name)?.marks || 0;
    // All marks for this chapter across all mocks
    const allMarks = allChapterPerformances
      .filter(ch => ch.chapters?.name === name)
      .map(ch => ch.marks)
      .filter(m => typeof m === 'number');
    const average = allMarks.length
      ? allMarks.reduce((a, b) => a + b, 0) / allMarks.length
      : 0;
    return {
      subject: name,
      current,
      average: Math.round(average),
      fullMark: 100,
    };
  });

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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigate('/battlefield/war/report/pts')}
              className="border-gray-700 text-gray-400 bg-gray-900 hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-400 p-1 rounded-full shadow-none"
              aria-label="Back to Report Card"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1" />
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-extrabold text-gray-100 mb-1">Compare Mock Tests</h1>
            <p className="text-base text-gray-400">Track your progress across multiple mock tests</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === 'score' ? 'default' : 'outline'}
            onClick={() => setActiveView('score')}
            className={`bg-gray-800 text-gray-100 border-gray-600 ${activeView === 'score' ? 'bg-purple-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Score Over Time
          </Button>
          <Button
            variant={activeView === 'accuracy' ? 'default' : 'outline'}
            onClick={() => setActiveView('accuracy')}
            className={`bg-gray-800 text-gray-100 border-gray-600 ${activeView === 'accuracy' ? 'bg-purple-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Accuracy Trends
          </Button>
          <Button
            variant={activeView === 'rank' ? 'default' : 'outline'}
            onClick={() => setActiveView('rank')}
            className={`bg-gray-800 text-gray-100 border-gray-600 ${activeView === 'rank' ? 'bg-purple-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Rank vs Percentile
          </Button>
          <Button
            variant={activeView === 'subjects' ? 'default' : 'outline'}
            onClick={() => setActiveView('subjects')}
            className={`bg-gray-800 text-gray-100 border-gray-600 ${activeView === 'subjects' ? 'bg-purple-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Subject Comparison
          </Button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-gray-800 text-gray-100 rounded-lg shadow">
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
                  mockData.length > 0 ? (
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mock" />
                      <YAxis />
                      <Tooltip contentStyle={{ background: '#1f2937', color: '#fff', border: '1px solid #374151' }} wrapperStyle={{ zIndex: 50 }} />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No mock test data available.</div>
                  )
                ) : activeView === 'accuracy' ? (
                  mockData.length > 0 ? (
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mock" />
                      <YAxis />
                      <Tooltip contentStyle={{ background: '#1f2937', color: '#fff', border: '1px solid #374151' }} wrapperStyle={{ zIndex: 50 }} />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No mock test data available.</div>
                  )
                ) : activeView === 'rank' ? (
                  mockData.length > 0 ? (
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mock" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip contentStyle={{ background: '#1f2937', color: '#fff', border: '1px solid #374151' }} wrapperStyle={{ zIndex: 50 }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="rank" stroke="#ff7300" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="percentile" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No mock test data available.</div>
                  )
                ) : (
                  mockData.length > 0 ? (
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip contentStyle={{ background: '#1f2937', color: '#fff', border: '1px solid #374151' }} wrapperStyle={{ zIndex: 50 }} />
                      <Legend />
                      <Bar dataKey="current" fill="#0088fe" />
                    </BarChart>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No mock test data available.</div>
                  )
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart for Subject Strengths */}
          <Card className="bg-gray-800 text-gray-100 rounded-lg shadow">
            <CardHeader>
              <CardTitle>Current vs Average Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {radarData.length > 0 ? (
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
              ) : (
                <div className="text-center text-gray-400 py-8">Not enough data to show radar chart.</div>
              )}
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="bg-gray-800 text-gray-100 rounded-lg shadow">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.length >= 2 ? (
                mockData.slice(-2).map((mock, index) => (
                  <div key={mock.mock} className="flex justify-between items-center p-3 bg-gray-900 rounded">
                    <div>
                      <p className="font-medium">{mock.mock}</p>
                      <p className="text-sm text-gray-400">{mock.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{mock.score}</span>
                        {index === 1 && getTrendIcon(mock.score, mockData[mockData.length - 2].score)}
                      </div>
                      <div className={`text-sm ${index === 1 ? getTrendColor(mock.percentile, mockData[mockData.length - 2].percentile) : 'text-gray-400'}`}>
                        {mock.percentile}%ile
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-400">Not enough data to show performance summary.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison Table */}
        <Card className="bg-gray-800 text-gray-100 rounded-lg shadow">
          <CardHeader>
            <CardTitle>Detailed Mock Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-100">
                <thead>
                  <tr className="border-b border-gray-700">
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
                    <tr key={mock.mock} className="border-b border-gray-700 hover:bg-gray-900">
                      <td className="p-2 font-medium">{mock.mock}</td>
                      <td className="p-2 text-center text-gray-400">{mock.date}</td>
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
