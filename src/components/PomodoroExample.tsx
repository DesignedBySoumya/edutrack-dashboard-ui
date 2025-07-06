import React, { useState, useEffect } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroExampleProps {
  subtopicId: number;
  subtopicName: string;
}

export const PomodoroExample: React.FC<PomodoroExampleProps> = ({ 
  subtopicId, 
  subtopicName 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  const { 
    sessionId, 
    isLoading, 
    error, 
    startSession, 
    endSession, 
    getProgress 
  } = usePomodoro(user?.id || '', subtopicId);

  useEffect(() => {
    // Load initial progress
    loadProgress();
  }, [subtopicId]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Session Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const loadProgress = async () => {
    try {
      const currentProgress = await getProgress();
      setProgress(currentProgress);
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const handleStartSession = async () => {
    try {
      await startSession('focus');
      setIsActive(true);
      toast({
        title: "Session Started",
        description: `Started studying ${subtopicName}`,
      });
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleEndSession = async (isCompleted: boolean = false) => {
    try {
      const result = await endSession(isCompleted);
      setIsActive(false);
      
      toast({
        title: "Session Ended",
        description: `Added ${result.addedMinutes} minutes to your progress`,
      });

      // Reload progress after session ends
      await loadProgress();
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
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
  );
}; 