import React, { useState } from 'react';
import { EnhancedPomodoroTimer } from '../components/EnhancedPomodoroTimer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Database,
  Timer
} from 'lucide-react';

const EnhancedPomodoroTest: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedSubjectName, setSelectedSubjectName] = useState('Indian Polity');
  
  const testSubjects = [
    { id: 1, name: 'Indian Polity', color: 'bg-blue-500' },
    { id: 2, name: 'Indian Economy', color: 'bg-green-500' },
    { id: 3, name: 'Geography', color: 'bg-purple-500' },
    { id: 4, name: 'History', color: 'bg-red-500' }
  ];

  const handleSubjectChange = (subjectId: number) => {
    const subject = testSubjects.find(s => s.id === subjectId);
    if (subject) {
      setSelectedSubject(subjectId);
      setSelectedSubjectName(subject.name);
    }
  };

  const testPageReload = () => {
    const confirmed = window.confirm(
      `🔄 Test Timer Persistence\n\nThis will reload the page to test if the timer resumes correctly.\n\nContinue?`
    );
    if (confirmed) {
      window.location.reload();
    }
  };

  const testTabSwitch = () => {
    const confirmed = window.confirm(
      `📱 Test Tab Switch\n\nThis will open a new tab. Switch between tabs to test timer persistence.\n\nContinue?`
    );
    if (confirmed) {
      window.open(window.location.href, '_blank');
    }
  };

  const clearLocalStorage = () => {
    const confirmed = window.confirm(
      '🧹 Clear localStorage\n\nThis will clear all session data from localStorage.\n\nContinue?'
    );
    if (confirmed) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🍅 Enhanced Pomodoro Timer Test
          </h1>
          <p className="text-gray-600">
            Test timer persistence, pause functionality, and cross-tab synchronization.
          </p>
        </div>

        {/* Key Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Enhanced Timer Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">Database Persistence</span>
                </div>
                <div className="text-sm text-green-700">
                  Timer state saved in Supabase
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Pause className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Pause & Resume</span>
                </div>
                <div className="text-sm text-blue-700">
                  Pause timer and resume later
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-800">Cross-Tab Sync</span>
                </div>
                <div className="text-sm text-purple-700">
                  Timer syncs across browser tabs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Pomodoro Timer */}
          <Card>
            <CardHeader>
              <CardTitle>🍅 Enhanced Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedPomodoroTimer
                subjectId={selectedSubject}
                subjectName={selectedSubjectName}
                onSessionEnd={() => console.log('Session ended')}
              />
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject Selection */}
              <div>
                <h3 className="font-semibold mb-2">Select Test Subject</h3>
                <div className="flex flex-wrap gap-2">
                  {testSubjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant={selectedSubject === subject.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSubjectChange(subject.id)}
                      className={selectedSubject === subject.id ? subject.color : ""}
                    >
                      {subject.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Persistence Tests */}
              <div>
                <h3 className="font-semibold mb-2">Persistence Tests</h3>
                <div className="space-y-2">
                  <Button
                    onClick={testPageReload}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    🔄 Test Page Reload (Timer Resume)
                  </Button>
                  
                  <Button
                    onClick={testTabSwitch}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    📱 Test Tab Switch
                  </Button>
                  
                  <Button
                    onClick={clearLocalStorage}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    🧹 Clear localStorage
                  </Button>
                </div>
              </div>

              {/* Timer Features */}
              <div>
                <h3 className="font-semibold mb-2">Timer Features</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-500" />
                    <span>Start 25-minute Pomodoro session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pause className="w-4 h-4 text-yellow-500" />
                    <span>Pause timer (safe to navigate away)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-500" />
                    <span>Resume from paused state</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-purple-500" />
                    <span>Reset session (end + start new)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Enhanced Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Timer persistence across reloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Pause state memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Database-first timer state</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Accurate time calculation</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Cross-tab synchronization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Navigation warnings for active sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Multiple session types</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Real-time progress tracking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Instructions */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Enhanced Timer Testing Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
              <li><strong>Start a session</strong> - Click "Start Session" to begin a 25-minute timer</li>
              <li><strong>Test pause/resume</strong> - Pause the timer, navigate away, then return and resume</li>
              <li><strong>Test page reload</strong> - Reload the page to verify timer resumes correctly</li>
              <li><strong>Test tab switching</strong> - Open multiple tabs and switch between them</li>
              <li><strong>Test session types</strong> - Try different session types (Focus, Topic, Test)</li>
              <li><strong>Check console logs</strong> - Monitor detailed session state changes</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Database Schema Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              New Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold text-blue-800 mb-2">user_daily_study_sessions</div>
                <div className="text-sm font-mono space-y-1 text-blue-700">
                  <div><span className="text-blue-600">session_type</span> TEXT ('focus', 'short_break', 'long_break')</div>
                  <div><span className="text-blue-600">duration_minutes</span> INTEGER</div>
                  <div><span className="text-blue-600">is_paused</span> BOOLEAN</div>
                  <div><span className="text-blue-600">paused_at</span> TIMESTAMP</div>
                  <div><span className="text-blue-600">remaining_seconds</span> INTEGER</div>
                  <div><span className="text-blue-600">status</span> TEXT ('active', 'completed', 'canceled')</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-semibold text-green-800 mb-2">user_subject_stats</div>
                <div className="text-sm font-mono space-y-1 text-green-700">
                  <div><span className="text-green-600">total_focus_seconds</span> INTEGER</div>
                  <div><span className="text-green-600">sessions_completed</span> INTEGER</div>
                  <div><span className="text-green-600">last_session_completed_at</span> TIMESTAMP</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPomodoroTest; 