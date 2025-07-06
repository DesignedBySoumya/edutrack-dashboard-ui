import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from './ui/use-toast';
import { RefreshCw, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function RLSDebug() {
  const { user } = useAuth();
  const [testRecords, setTestRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTestRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading test records:', error);
        toast({
          title: "Load Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTestRecords(data || []);
      console.log('🔍 RLS Debug: Loaded records:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestRecord = async () => {
    if (!user) return;

    const testSubtopicId = Math.floor(Math.random() * 1000) + 1000; // Random ID
    
    try {
      const { data, error } = await supabase
        .from('user_subtopic_progress')
        .insert({
          user_id: user.id,
          subtopic_id: testSubtopicId,
          is_completed: Math.random() > 0.5, // Random completion status
          time_spent_minutes: Math.floor(Math.random() * 60),
          last_studied_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating test record:', error);
        toast({
          title: "Create Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 RLS Debug: Created record:', data);
      toast({
        title: "Success",
        description: `Created test record for subtopic ${testSubtopicId}`,
      });

      // Reload records
      await loadTestRecords();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateTestRecord = async (recordId: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subtopic_progress')
        .update({
          is_completed: !testRecords.find(r => r.id === recordId)?.is_completed,
          last_studied_at: new Date().toISOString()
        })
        .eq('id', recordId)
        .eq('user_id', user.id) // Extra safety check
        .select()
        .single();

      if (error) {
        console.error('Error updating test record:', error);
        toast({
          title: "Update Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 RLS Debug: Updated record:', data);
      toast({
        title: "Success",
        description: `Updated record ${recordId}`,
      });

      // Reload records
      await loadTestRecords();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteTestRecord = async (recordId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_subtopic_progress')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user.id); // Extra safety check

      if (error) {
        console.error('Error deleting test record:', error);
        toast({
          title: "Delete Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 RLS Debug: Deleted record:', recordId);
      toast({
        title: "Success",
        description: `Deleted record ${recordId}`,
      });

      // Reload records
      await loadTestRecords();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const testUpsert = async () => {
    if (!user) return;

    const testSubtopicId = Math.floor(Math.random() * 1000) + 2000; // Different range
    const randomCompleted = Math.random() > 0.5;
    
    try {
      console.log(`🔍 RLS Debug: Testing upsert for subtopic ${testSubtopicId}, completed: ${randomCompleted}`);
      
      const { data, error } = await supabase
        .from('user_subtopic_progress')
        .upsert({
          user_id: user.id,
          subtopic_id: testSubtopicId,
          is_completed: randomCompleted,
          time_spent_minutes: Math.floor(Math.random() * 60),
          last_studied_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,subtopic_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting test record:', error);
        toast({
          title: "Upsert Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 RLS Debug: Upserted record:', data);
      toast({
        title: "Success",
        description: `Upserted record for subtopic ${testSubtopicId}`,
      });

      // Reload records
      await loadTestRecords();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadTestRecords();
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>RLS Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Please log in to test RLS policies</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>RLS Debug - user_subtopic_progress</span>
          <Button onClick={loadTestRecords} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={createTestRecord} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Test Record
          </Button>
          <Button onClick={testUpsert} size="sm" variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Test Upsert
          </Button>
        </div>

        {/* User Info */}
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>User ID:</span>
            <span className="font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-mono">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Records Found:</span>
            <span>{testRecords.length}</span>
          </div>
        </div>

        {/* Test Records */}
        {testRecords.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recent Records:</h4>
            {testRecords.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-2 border rounded text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono">ID: {record.id}</span>
                  <span>Subtopic: {record.subtopic_id}</span>
                  <Badge variant={record.is_completed ? "default" : "secondary"}>
                    {record.is_completed ? '✓' : '○'}
                  </Badge>
                  <span>{record.time_spent_minutes}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    onClick={() => updateTestRecord(record.id)} 
                    size="sm" 
                    variant="outline"
                  >
                    Toggle
                  </Button>
                  <Button 
                    onClick={() => deleteTestRecord(record.id)} 
                    size="sm" 
                    variant="outline"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {testRecords.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No records found. Create some test records!</p>
        )}
      </CardContent>
    </Card>
  );
} 