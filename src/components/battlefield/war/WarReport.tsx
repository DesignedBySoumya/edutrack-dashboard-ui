
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WarReportProps {
  onNewBattle: () => void;
}

const WarReport = ({ onNewBattle }: WarReportProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📊 DETAILED WAR REPORT</h1>
          <p className="text-slate-300">Analyze your battle performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['Physics', 'Chemistry', 'Mathematics'].map((subject, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">{subject}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {[80, 70, 75][index]}%
                </div>
                <div className="text-slate-300 text-sm">
                  {[24, 21, 22][index]} out of 30
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-300">
              <p>Total Time: 2h 45m</p>
              <p>Average per Question: 1m 39s</p>
              <p>Time Saved: 15m</p>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onNewBattle}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg"
        >
          START NEW BATTLE
        </Button>
      </div>
    </div>
  );
};

export default WarReport;
