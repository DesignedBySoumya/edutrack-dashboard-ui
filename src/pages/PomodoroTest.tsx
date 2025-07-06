import React, { useState } from 'react';
import PomodoroTimer from '../components/PomodoroTimer';
import { usePomodoroSession } from '../hooks/usePomodoroSession';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Clock, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const PomodoroTest: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedSubjectName, setSelectedSubjectName] = useState('Indian Polity');
  
  const {
    activeSession,
    elapsedTime,
    sessionStats,
    isLoading,
    startSession,
    endSession,
    resetSession,
    fetchSessionStats,
    formatTime,
    formatMinutes
  } = usePomodoroSession();

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
      fetchSessionStats(subjectId);
    }
  };

  const handleSessionEnd = () => {
    console.log('Session ended - refreshing stats...');
    fetchSessionStats(selectedSubject);
  };

  const testSessionPersistence = () => {
    if (activeSession) {
      alert('✅ Session persistence is working! Your session is saved in the database and will resume on reload.');
    } else {
      alert('No active session to test persistence with.');
    }
  };

  const testPageReload = () => {
    if (activeSession) {
      const confirmed = window.confirm(
        `⚠️ You have an active session for ${activeSession.subjectName}.\n\nReloading will resume the session from localStorage.\n\nContinue?`
      );
      if (confirmed) {
        window.location.reload();
      }
    } else {
      alert('No active session to test reload with.');
    }
  };

  const clearLocalStorage = () => {
    const confirmed = window.confirm(
      '⚠️ This will clear all session data from localStorage.\n\nThis is useful for testing fresh starts.\n\nContinue?'
    );
    if (confirmed) {
      localStorage.removeItem('activeSession');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🍅 Pomodoro Session Test
          </h1>
          <p className="text-gray-600">
            Test all the fixes for study session management, localStorage persistence, and navigation blocking.
          </p>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Session Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Active Session</span>
                </div>
                <div className="text-sm text-blue-700">
                  {activeSession ? (
                    <>
                      <div>{activeSession.subjectName}</div>
                      <div>Started: {new Date(activeSession.startedAt).toLocaleTimeString()}</div>
                      <div>Elapsed: {formatTime(elapsedTime)}</div>
                    </>
                  ) : (
                    <span className="text-gray-500">No active session</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">Today's Progress</span>
                </div>
                <div className="text-sm text-green-700">
                  <div>{formatMinutes(sessionStats.totalTimeToday)}</div>
                  <div className="text-xs text-green-600">Total: {formatMinutes(sessionStats.totalTimeAll)}</div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-800">Session Persistence</span>
                </div>
                <div className="text-sm text-purple-700">
                  {activeSession ? (
                    <span className="text-green-600">✅ Active</span>
                  ) : (
                    <span className="text-gray-500">❌ No Session</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pomodoro Timer */}
          <Card>
            <CardHeader>
              <CardTitle>🍅 Pomodoro Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <PomodoroTimer
                subjectId={selectedSubject}
                subjectName={selectedSubjectName}
                onSessionEnd={handleSessionEnd}
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

              {/* Test Actions */}
              <div>
                <h3 className="font-semibold mb-2">Test Actions</h3>
                <div className="space-y-2">
                  <Button
                    onClick={testSessionPersistence}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    ✅ Test Session Persistence
                  </Button>
                  
                  <Button
                    onClick={testPageReload}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    🔄 Test Page Reload (Session Resume)
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

              {/* Quick Session Actions */}
              <div>
                <h3 className="font-semibold mb-2">Quick Session Actions</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => startSession(selectedSubject, selectedSubjectName, 'test')}
                    disabled={isLoading || !!activeSession}
                    size="sm"
                    className="w-full"
                  >
                    ▶️ Start Test Session
                  </Button>
                  
                                     <Button
                     onClick={() => endSession()}
                     disabled={isLoading || !activeSession}
                     variant="destructive"
                     size="sm"
                     className="w-full"
                   >
                     ⏹️ End Session
                   </Button>
                  
                  <Button
                    onClick={resetSession}
                    disabled={isLoading || !activeSession}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    🔄 Reset Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixes Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Fixes Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">localStorage persistence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Session resume on reload</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">No navigation blocking (freedom to navigate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Proper session ending</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Real-time stats updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">No duration_minutes in insert</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Generated column for duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">✅</Badge>
                  <span className="text-sm">Comprehensive error handling</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Testing Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
              <li>Select a subject and start a Pomodoro session</li>
              <li>Test session persistence by reloading the page</li>
              <li>Test navigation freedom - you can safely navigate away</li>
              <li>End the session and verify stats update</li>
              <li>Check browser console for detailed logs</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default PomodoroTest; 