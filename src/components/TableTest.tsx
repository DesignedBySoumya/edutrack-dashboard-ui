import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export default function TableTest() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testTableAccess = async () => {
    if (!user) {
      setTestResult('User not authenticated');
      return;
    }

    try {
      setTestResult('Testing table access...');

      // Test 1: Simple select
      const { data: selectData, error: selectError } = await supabase
        .from('user_daily_study_sessions')
        .select('*')
        .limit(1);

      if (selectError) {
        setTestResult(`SELECT Error: ${selectError.message}`);
        console.error('Select error:', selectError);
        return;
      }

      setTestResult(`SELECT Success: Found ${selectData?.length || 0} records`);

      // Test 2: Simple insert
      const testData = {
        user_id: user.id,
        subject_id: 1,
        started_at: new Date().toISOString(),
        duration_minutes: 10,
        session_type: 'test'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('user_daily_study_sessions')
        .insert(testData)
        .select()
        .single();

      if (insertError) {
        setTestResult(`INSERT Error: ${insertError.message}`);
        console.error('Insert error:', insertError);
        return;
      }

      setTestResult(`INSERT Success: Created session ID ${insertData.id}`);

      // Test 3: Update
      const { error: updateError } = await supabase
        .from('user_daily_study_sessions')
        .update({ duration_minutes: 20 })
        .eq('id', insertData.id);

      if (updateError) {
        setTestResult(`UPDATE Error: ${updateError.message}`);
        console.error('Update error:', updateError);
        return;
      }

      setTestResult(`All tests passed! Session ID ${insertData.id} created and updated successfully.`);

    } catch (error) {
      setTestResult(`Unexpected error: ${error}`);
      console.error('Test error:', error);
    }
  };

  const clearTestSessions = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_daily_study_sessions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: `Failed to clear sessions: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Cleared all test sessions",
        });
        setTestResult('');
      }
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Table Access Test</span>
          <Button onClick={clearTestSessions} variant="outline" size="sm">
            Clear Test Data
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>User:</span>
            <span className="font-mono">{user?.email || 'Not logged in'}</span>
          </div>
          <div className="flex justify-between">
            <span>User ID:</span>
            <span className="font-mono">{user?.id || 'N/A'}</span>
          </div>
        </div>

        <Button onClick={testTableAccess} className="w-full">
          Test user_daily_study_sessions Table
        </Button>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded text-sm font-mono">
            {testResult}
          </div>
        )}

        <div className="text-xs text-gray-600">
          <p><strong>What this tests:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Table exists and is accessible</li>
            <li>RLS policies allow SELECT, INSERT, UPDATE</li>
            <li>Data types are correct</li>
            <li>Foreign key constraints work</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 