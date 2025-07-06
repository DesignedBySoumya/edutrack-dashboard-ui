import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function CheckboxLogicTest() {
  const [isChecked, setIsChecked] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleToggle = () => {
    const newStatus = !isChecked;
    
    addLog(`🔍 Toggle Debug:`);
    addLog(`  - Current isCompleted: ${isChecked}`);
    addLog(`  - Attempting to set to: ${newStatus}`);
    addLog(`  - Checkbox State: ${isChecked ? 'CHECKED' : 'UNCHECKED'}`);
    addLog(`  - Action: ${isChecked ? 'Unchecking' : 'Checking'}`);
    
    // Simulate database save
    addLog(`  - Saving to database: is_completed = ${newStatus}`);
    
    // Update state
    setIsChecked(newStatus);
    
    // Show result
    addLog(`🔍 Final Result: Checkbox is now ${newStatus ? 'CHECKED (Completed)' : 'UNCHECKED (Not Completed)'}`);
    addLog(`  - Database value: ${newStatus}`);
    addLog(`  - UI shows: ${newStatus ? '✅ Completed' : '❌ Unchecked'}`);
    addLog('---');
  };

  const clearLog = () => {
    setLog([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Checkbox Logic Test</span>
          <Button onClick={clearLog} variant="outline" size="sm">
            Clear Log
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Checkbox Display */}
        <div className="flex items-center space-x-4 p-4 border rounded-lg">
          <button
            onClick={handleToggle}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isChecked 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {isChecked && <CheckCircle className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center space-x-2">
            <span className={isChecked ? 'line-through text-gray-500' : ''}>
              Test Topic
            </span>
            <Badge variant={isChecked ? "default" : "secondary"}>
              {isChecked ? '✅ Completed' : '❌ Unchecked'}
            </Badge>
          </div>
        </div>

        {/* Current State Display */}
        <div className="text-sm space-y-1 p-3 bg-gray-50 rounded">
          <div className="flex justify-between">
            <span>Current State:</span>
            <span className="font-mono">{isChecked ? 'true' : 'false'}</span>
          </div>
          <div className="flex justify-between">
            <span>Database Value:</span>
            <span className="font-mono">is_completed = {isChecked ? 'true' : 'false'}</span>
          </div>
          <div className="flex justify-between">
            <span>UI Display:</span>
            <span>{isChecked ? '✅ Completed' : '❌ Unchecked'}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Expected Behavior:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>When checkbox is <strong>CHECKED</strong> → Database: <code>true</code> → UI: "✅ Completed"</li>
            <li>When checkbox is <strong>UNCHECKED</strong> → Database: <code>false</code> → UI: "❌ Unchecked"</li>
            <li>Toast should show the <strong>new status</strong> (after toggle)</li>
          </ul>
        </div>

        {/* Debug Log */}
        {log.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Debug Log:</h4>
            <div className="max-h-40 overflow-y-auto text-xs font-mono bg-gray-900 text-green-400 p-2 rounded">
              {log.map((entry, index) => (
                <div key={index}>{entry}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 