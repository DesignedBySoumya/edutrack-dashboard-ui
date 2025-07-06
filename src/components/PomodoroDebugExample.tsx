import React, { useState, useEffect } from 'react';
import { usePomodoroDebug } from '@/hooks/usePomodoroDebug';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Square, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface PomodoroDebugExampleProps {
  subtopicId: number;
  subtopicName: string;
}

export const PomodoroDebugExample: React.FC<PomodoroDebugExampleProps> = ({ 
  subtopicId, 
  subtopicName 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const { 
    sessionId, 
    isLoading, 
    error, 
    startSession, 
    endSession, 
    getProgress 
  } = usePomodoroDebug(user?.id || '', subtopicId);

  useEffect(() => {
    // Load initial progress
    loadProgress();
    checkTableStructure();
  }, [subtopicId]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Session Error",
        description: error,
        variant: "destructive",
      });
      addDebugInfo(`Error: ${error}`);
    }
  }, [error, toast]);

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkTableStructure = async () => {
    try {
      addDebugInfo('Checking table structure...');
      
      // Check if user_subtopic_progress table exists and has correct structure
      const { data: tableInfo, error: tableError } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .limit(1);

      if (tableError) {
        addDebugInfo(`Table error: ${tableError.message}`);
        console.error('Table structure error:', tableError);
      } else {
        addDebugInfo('Table structure check passed');
      }

      // Check RLS policies
      addDebugInfo('Checking RLS policies...');
      const { data: policies, error: policyError } = await supabase
        .rpc('get_policies', { table_name: 'user_subtopic_progress' })
        .catch(() => ({ data: null, error: { message: 'Could not check policies' } }));

      if (policyError) {
        addDebugInfo(`Policy check error: ${policyError.message}`);
      } else {
        addDebugInfo('RLS policies check completed');
      }

    } catch (err) {
      addDebugInfo(`Structure check failed: ${err}`);
    }
  };

  const loadProgress = async () => {
    try {
      addDebugInfo('Loading progress...');
      const currentProgress = await getProgress();
      setProgress(currentProgress);
      addDebugInfo(`Progress loaded: ${currentProgress ? 'Found' : 'Not found'}`);
    } catch (err) {
      addDebugInfo(`Failed to load progress: ${err}`);
      console.error('Failed to load progress:', err);
    }
  };

  const handleStartSession = async () => {
    try {
      addDebugInfo('Starting session...');
      await startSession('focus');
      setIsActive(true);
      addDebugInfo('Session started successfully');
      toast({
        title: "Session Started",
        description: `Started studying ${subtopicName}`,
      });
    } catch (err) {
      addDebugInfo(`Failed to start session: ${err}`);
      console.error('Failed to start session:', err);
    }
  };

  const handleEndSession = async (isCompleted: boolean = false) => {
    try {
      addDebugInfo(`Ending session (completed: ${isCompleted})...`);
      const result = await endSession(isCompleted);
      setIsActive(false);
      
      addDebugInfo(`Session ended. Added ${result.addedMinutes} minutes`);
      toast({
        title: "Session Ended",
        description: `Added ${result.addedMinutes} minutes to your progress`,
      });

      // Reload progress after session ends
      await loadProgress();
    } catch (err) {
      addDebugInfo(`Failed to end session: ${err}`);
      console.error('Failed to end session:', err);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{subtopicName}</span>
            {progress?.is_completed && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Display */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Spent:</span>
              <span className="font-medium">
                {progress ? formatTime(progress.time_spent_minutes) : '0m'}
              </span>
            </div>
            {progress?.last_studied_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Studied:</span>
                <span className="font-medium">
                  {new Date(progress.last_studied_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Session Controls */}
          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                onClick={handleStartSession} 
                disabled={isLoading}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => handleEndSession(false)} 
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
                <Button 
                  onClick={() => handleEndSession(true)} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </>
            )}
          </div>

          {/* Session Status */}
          {sessionId && (
            <div className="text-center">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Session Active
              </Badge>
            </div>
          )}

          {isLoading && (
            <div className="text-center text-sm text-muted-foreground">
              Processing...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Debug Info
            </span>
            <Button 
              onClick={clearDebugInfo} 
              variant="outline" 
              size="sm"
            >
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {debugInfo.length === 0 ? (
              <p className="text-sm text-muted-foreground">No debug info yet...</p>
            ) : (
              debugInfo.map((info, index) => (
                <div key={index} className="text-xs font-mono bg-gray-100 p-2 rounded">
                  {info}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            User Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>User ID:</span>
              <span className="font-mono text-xs">{user?.id || 'Not logged in'}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtopic ID:</span>
              <span className="font-mono">{subtopicId}</span>
            </div>
            <div className="flex justify-between">
              <span>Session ID:</span>
              <span className="font-mono text-xs">{sessionId || 'None'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 