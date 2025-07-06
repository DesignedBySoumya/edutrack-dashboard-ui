import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Database, AlertCircle, CheckCircle } from 'lucide-react';

export const AuthDebug: React.FC = () => {
  const { user } = useAuth();
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      setAuthStatus({
        session,
        currentUser,
        sessionError,
        userError,
        contextUser: user
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseAccess = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setTestResult({ error: 'No user logged in' });
        return;
      }

      // Test 1: Try to insert a test record
      const testData = {
        user_id: user.id,
        subtopic_id: 999999, // Use a dummy ID that shouldn't exist
        is_completed: false,
        time_spent_minutes: 0,
        last_studied_at: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await supabase
        .from('user_subtopic_progress')
        .insert([testData])
        .select();

      if (insertError) {
        setTestResult({ 
          type: 'insert_error',
          error: insertError,
          testData 
        });
        return;
      }

      // Test 2: Try to select the record we just inserted
      const { data: selectData, error: selectError } = await supabase
        .from('user_subtopic_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('subtopic_id', 999999);

      if (selectError) {
        setTestResult({ 
          type: 'select_error',
          error: selectError 
        });
        return;
      }

      // Test 3: Clean up - delete the test record
      const { error: deleteError } = await supabase
        .from('user_subtopic_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('subtopic_id', 999999);

      setTestResult({
        type: 'success',
        insertData,
        selectData,
        deleteError,
        message: 'Database access test completed successfully'
      });

    } catch (error) {
      console.error('Error testing database access:', error);
      setTestResult({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const formatUUID = (uuid: string) => {
    if (!uuid) return 'N/A';
    return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 4)}`;
  };

  return (
    <div className="space-y-4">
      {/* Auth Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Context User:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">
                  {user ? formatUUID(user.id) : 'Not logged in'}
                </span>
                {user ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Supabase User:</span>
              <span className="font-mono text-sm">
                {authStatus?.currentUser ? formatUUID(authStatus.currentUser.id) : 'Loading...'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Session Active:</span>
              <Badge variant={authStatus?.session ? "default" : "secondary"}>
                {authStatus?.session ? 'Yes' : 'No'}
              </Badge>
            </div>

            {authStatus?.sessionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Session Error:</strong> {authStatus.sessionError.message}
                </p>
              </div>
            )}

            {authStatus?.userError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>User Error:</strong> {authStatus.userError.message}
                </p>
              </div>
            )}

            <Button onClick={checkAuthStatus} disabled={loading} variant="outline" size="sm">
              Refresh Auth Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Access Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              onClick={testDatabaseAccess} 
              disabled={loading || !user}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Database Access'}
            </Button>

            {testResult && (
              <div className={`p-3 border rounded-lg ${
                testResult.error || testResult.type === 'insert_error' || testResult.type === 'select_error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}>
                <h4 className="font-semibold mb-2">
                  {testResult.error ? '❌ Test Failed' : '✅ Test Passed'}
                </h4>
                
                {testResult.error && (
                  <p className="text-sm text-red-700 mb-2">
                    <strong>Error:</strong> {testResult.error.message}
                  </p>
                )}

                {testResult.type === 'insert_error' && (
                  <div className="space-y-2">
                    <p className="text-sm text-red-700">
                      <strong>Insert Error:</strong> {testResult.error.message}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Test Data:</strong> {JSON.stringify(testResult.testData, null, 2)}
                    </p>
                  </div>
                )}

                {testResult.type === 'success' && (
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">
                      {testResult.message}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Inserted:</strong> {testResult.insertData?.length || 0} records
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Selected:</strong> {testResult.selectData?.length || 0} records
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>User ID Match:</span>
              <Badge variant={
                user?.id === authStatus?.currentUser?.id ? "default" : "destructive"
              }>
                {user?.id === authStatus?.currentUser?.id ? 'Match' : 'Mismatch'}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span>Context User ID:</span>
              <span className="font-mono text-xs">{user?.id || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Supabase User ID:</span>
              <span className="font-mono text-xs">{authStatus?.currentUser?.id || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 