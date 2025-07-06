import React from 'react';
import StudySessionDebug from '../components/StudySessionDebug';

const StudySessionTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Study Session Debug Test</h1>
          <p className="text-gray-600 mt-2">
            Use this page to test study session logging and debug any issues with the Supabase table.
          </p>
        </div>
        
        <StudySessionDebug />
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Instructions</h2>
          <div className="space-y-2 text-blue-800">
            <p><strong>1. Check User:</strong> Verify you're logged in and get user info</p>
            <p><strong>2. Check Table:</strong> Test if the table structure is accessible</p>
            <p><strong>3. Fetch Sessions:</strong> Load existing study sessions</p>
            <p><strong>4. Test Insert:</strong> Create a test session to verify insert works</p>
            <p><strong>5. Clear All:</strong> Remove all sessions (use with caution)</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• If "Check Table" fails, run the SQL script in Supabase</li>
              <li>• If "Test Insert" fails, check RLS policies</li>
              <li>• Check browser console for detailed error logs</li>
              <li>• Verify user authentication is working</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySessionTest; 