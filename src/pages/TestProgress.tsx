import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthDebug } from '@/components/AuthDebug';
import { CheckboxTest } from '@/components/CheckboxTest';
import RLSDebug from '@/components/RLSDebug';
import CheckboxLogicTest from '@/components/CheckboxLogicTest';
import StudySessionDebug from '@/components/StudySessionDebug';
import TableTest from '@/components/TableTest';

export default function TestProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load subtopics
      const { data: subtopicsData, error: subtopicsError } = await supabase
        .from('subtopics')
        .select('*')
        .limit(10);

      if (subtopicsError) {
        console.error('Error loading subtopics:', subtopicsError);
        return;
      }

      setSubtopics(subtopicsData || []);

      // Load user progress if authenticated
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_subtopic_progress')
          .select('*')
          .eq('user_id', user.id);

        if (!progressError) {
          setUserProgress(progressData || []);
        } else {
          console.error('Error loading user progress:', progressError);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubtopic = async (subtopicId: number) => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please log in to save progress",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find existing progress
      const existingProgress = userProgress.find(p => p.subtopic_id === subtopicId);
      const currentCompleted = existingProgress?.is_completed || false;

      console.log(`🔍 TestProgress Toggle Debug:`);
      console.log(`  - Subtopic ID: ${subtopicId}`);
      console.log(`  - Current isCompleted: ${currentCompleted}`);
      console.log(`  - Attempting to set to: ${!currentCompleted}`);
      console.log(`  - Checkbox State: ${currentCompleted ? 'CHECKED' : 'UNCHECKED'}`);

      // Toggle completion
      const { error } = await supabase
        .from('user_subtopic_progress')
        .upsert({
          user_id: user.id,
          subtopic_id: subtopicId,
          is_completed: !currentCompleted,
          time_spent_minutes: existingProgress?.time_spent_minutes || 0,
          last_studied_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,subtopic_id'
        });

      if (error) {
        console.error('Error toggling subtopic:', error);
        toast({
          title: "Error",
          description: "Failed to save progress",
          variant: "destructive",
        });
        return;
      }

      // Small delay to ensure upsert has completed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Refetch the updated progress to ensure we have the correct state
      const { data: updatedProgress, error: refetchError } = await supabase
        .from('user_subtopic_progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('subtopic_id', subtopicId)
        .maybeSingle();

      if (refetchError) {
        console.error('Error refetching progress:', refetchError);
      }

      // Use the refetched status or fallback to what we just tried to save
      const attemptedStatus = !currentCompleted;
      const newStatus = updatedProgress?.is_completed ?? attemptedStatus;
      console.log(`🔍 TestProgress Refetch Debug: Attempted to save: ${attemptedStatus}`);
      console.log(`🔍 TestProgress Refetch Debug: Supabase returned: ${updatedProgress?.is_completed}`);
      console.log(`🔍 TestProgress Refetch Debug: Final status: ${newStatus}`);
      console.log(`🔍 TestProgress Refetch Debug: Refetch error:`, refetchError);

      // Update local state
      setUserProgress(prev => {
        const existing = prev.find(p => p.subtopic_id === subtopicId);
        if (existing) {
          return prev.map(p => 
            p.subtopic_id === subtopicId 
              ? { ...p, is_completed: newStatus }
              : p
          );
        } else {
          return [...prev, {
            user_id: user.id,
            subtopic_id: subtopicId,
            is_completed: newStatus,
            time_spent_minutes: 0,
            last_studied_at: new Date().toISOString()
          }];
        }
      });

      toast({
        title: "Progress Saved",
        description: `Subtopic ${newStatus ? '✅ completed' : '❌ unchecked'}`,
      });
      
      console.log(`🔍 Final Result: Checkbox is now ${newStatus ? 'CHECKED (Completed)' : 'UNCHECKED (Not Completed)'}`);
    } catch (error) {
      console.error('Error toggling subtopic:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
    }
  };

  const getSubtopicStatus = (subtopicId: number) => {
    return userProgress.find(p => p.subtopic_id === subtopicId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Auth Debug */}
        <AuthDebug />

        {/* Checkbox Test */}
        <CheckboxTest />

        {/* RLS Debug */}
        <RLSDebug />

        {/* Checkbox Logic Test */}
        <CheckboxLogicTest />

        {/* Study Session Debug */}
        <StudySessionDebug />

        {/* Table Test */}
        <TableTest />

        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Progress Test</span>
              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-mono">{user?.email || 'Not logged in'}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtopics:</span>
                <span>{subtopics.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Progress Records:</span>
                <span>{userProgress.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subtopics List */}
        <Card>
          <CardHeader>
            <CardTitle>Test Subtopics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subtopics.map((subtopic) => {
                const progress = getSubtopicStatus(subtopic.id);
                const isCompleted = progress?.is_completed || false;
                
                return (
                  <div 
                    key={subtopic.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleSubtopic(subtopic.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4" />}
                      </button>
                      <span className={isCompleted ? 'line-through text-gray-500' : ''}>
                        {subtopic.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {progress && (
                        <>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {progress.time_spent_minutes}m
                          </Badge>
                          <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                            {isCompleted ? 'Completed' : 'In Progress'}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        {userProgress.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userProgress.map((progress) => {
                  const subtopic = subtopics.find(s => s.id === progress.subtopic_id);
                  return (
                    <div key={progress.subtopic_id} className="flex justify-between text-sm">
                      <span>{subtopic?.name || `Subtopic ${progress.subtopic_id}`}</span>
                      <div className="flex items-center space-x-2">
                        <span>{progress.time_spent_minutes}m</span>
                        <Badge variant={progress.is_completed ? "default" : "secondary"} className="text-xs">
                          {progress.is_completed ? '✓' : '○'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 