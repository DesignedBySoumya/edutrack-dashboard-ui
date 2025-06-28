
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WarConfigurationProps {
  onNext: () => void;
}

const WarConfiguration = ({ onNext }: WarConfigurationProps) => {
  const [selectedMode, setSelectedMode] = useState<'full' | 'subject'>('full');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">⚔️ WAR CONFIGURATION</h1>
          <p className="text-slate-300">Configure your battle parameters</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Select Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={selectedMode === 'full' ? 'default' : 'outline'}
                  onClick={() => setSelectedMode('full')}
                  className="h-20"
                >
                  Full Test
                </Button>
                <Button
                  variant={selectedMode === 'subject' ? 'default' : 'outline'}
                  onClick={() => setSelectedMode('subject')}
                  className="h-20"
                >
                  Subject Wise
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={onNext}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg"
          >
            BEGIN BATTLE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarConfiguration;
