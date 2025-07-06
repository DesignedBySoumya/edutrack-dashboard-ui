import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

interface StudySession {
  id: string;
  user_id: string;
  subject_id: number | null;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  session_type: string;
  created_at: string;
  updated_at: string;
}

const StudySessionDebug: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableStructure, setTableStructure] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchTableStructure();
  }, []);

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(user);
      console.log('Current user:', user);
    }
  };

  const fetchTableStructure = async () => {
    try {
      // This is a simple way to check table structure
      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Table structure check error:', error);
        toast({
          title: "Table Error",
          description: `Table access error: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Table structure check passed');
        toast({
          title: "Table OK",
          description: "Table structure is accessible",
        });
      }
    } catch (err) {
      console.error('Table structure check failed:', err);
    }
  };

  const fetchSessions = async () => {
    if (!user) {
      toast({
        title: "No User",
        description: "Please log in first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch sessions error:', error);
        toast({
          title: "Fetch Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSessions(data || []);
        console.log('Fetched sessions:', data);
        toast({
          title: "Sessions Fetched",
          description: `Found ${data?.length || 0} sessions`,
        });
      }
    } catch (err) {
      console.error('Fetch sessions failed:', err);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testInsertSession = async () => {
    if (!user) {
      toast({
        title: "No User",
        description: "Please log in first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        user_id: user.id,
        subject_id: 1, // Test with subject ID 1
        started_at: new Date().toISOString(),
        session_type: 'test'
        // ⛔ DO NOT send duration_minutes - it will be calculated when session ends
      };

      console.log('🔍 Testing session insert with data:', sessionData);

      const { data, error } = await supabase
        .from('user_daily_study_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('❌ Insert test failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast({
          title: "Insert Test Failed",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('✅ Insert test successful:', data);
        toast({
          title: "Insert Test Success",
          description: "Test session created successfully",
        });
        // Refresh sessions list
        fetchSessions();
      }
    } catch (err) {
      console.error('❌ Insert test exception:', err);
      toast({
        title: "Insert Test Exception",
        description: "Exception during insert test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_daily_study_sessions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Clear sessions error:', error);
        toast({
          title: "Clear Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setSessions([]);
        toast({
          title: "Sessions Cleared",
          description: "All sessions deleted",
        });
      }
    } catch (err) {
      console.error('Clear sessions failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Session Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={checkUser} variant="outline">
              Check User
            </Button>
            <Button onClick={fetchTableStructure} variant="outline">
              Check Table
            </Button>
            <Button onClick={fetchSessions} variant="outline" disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Sessions'}
            </Button>
            <Button onClick={testInsertSession} variant="outline" disabled={loading}>
              Test Insert
            </Button>
            <Button onClick={clearAllSessions} variant="destructive" disabled={loading}>
              Clear All
            </Button>
          </div>

          {user && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">User Info</h3>
              <p className="text-sm text-green-700">ID: {user.id}</p>
              <p className="text-sm text-green-700">Email: {user.email}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Sessions ({sessions.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sessions.map((session) => (
                <div key={session.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Session {session.id.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-600">
                        Subject: {session.subject_id || 'None'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Started: {formatDate(session.started_at)}
                      </p>
                      {session.ended_at && (
                        <p className="text-sm text-gray-600">
                          Ended: {formatDate(session.ended_at)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{session.session_type}</Badge>
                      <p className="text-sm font-medium mt-1">
                        {formatDuration(session.duration_minutes)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No sessions found</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudySessionDebug; 