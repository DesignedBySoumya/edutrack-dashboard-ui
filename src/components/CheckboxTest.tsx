import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const CheckboxTest: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    
    // Log the correct behavior
    addLog(`Checkbox changed: ${newValue ? 'Checked' : 'Unchecked'}`);
    addLog(`e.target.checked = ${newValue}`);
    addLog(`isChecked state = ${newValue}`);
  };

  const handleCustomToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    addLog(`Custom toggle: ${newValue ? 'Checked' : 'Unchecked'}`);
  };

  const clearLogs = () => {
    setLogMessages([]);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Checkbox Test</span>
          <Button onClick={clearLogs} variant="outline" size="sm">
            Clear Logs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Standard HTML Checkbox */}
        <div className="space-y-2">
          <h3 className="font-semibold">Standard HTML Checkbox</h3>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-4 h-4"
            />
            <span>Standard checkbox</span>
            <Badge variant={isChecked ? "default" : "secondary"}>
              {isChecked ? 'Checked' : 'Unchecked'}
            </Badge>
          </div>
        </div>

        {/* Custom Toggle Button */}
        <div className="space-y-2">
          <h3 className="font-semibold">Custom Toggle Button</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCustomToggle}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isChecked 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isChecked && <span className="text-xs">✓</span>}
            </button>
            <span>Custom button</span>
            <Badge variant={isChecked ? "default" : "secondary"}>
              {isChecked ? 'Checked' : 'Unchecked'}
            </Badge>
          </div>
        </div>

        {/* State Display */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Current State</h4>
          <div className="space-y-1 text-sm">
            <div>isChecked: <span className="font-mono">{isChecked.toString()}</span></div>
            <div>Type: <span className="font-mono">{typeof isChecked}</span></div>
          </div>
        </div>

        {/* Log Messages */}
        <div className="space-y-2">
          <h3 className="font-semibold">Event Log</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {logMessages.length === 0 ? (
              <p className="text-sm text-gray-500">No events yet...</p>
            ) : (
              logMessages.map((message, index) => (
                <div key={index} className="text-xs font-mono bg-gray-100 p-1 rounded">
                  {message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Test Instructions</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click the standard checkbox</li>
            <li>• Click the custom button</li>
            <li>• Watch the event log</li>
            <li>• Verify the state updates correctly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 