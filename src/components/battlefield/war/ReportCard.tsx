
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportCardProps {
  onNext: () => void;
  onNewBattle: () => void;
}

const ReportCard = ({ onNext, onNewBattle }: ReportCardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏆 BATTLE REPORT</h1>
          <p className="text-slate-300">Your performance summary</p>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-center">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-orange-400 mb-2">75%</div>
            <div className="text-slate-300">375 out of 500 marks</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">85</div>
              <div className="text-slate-300 text-sm">Correct</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">15</div>
              <div className="text-slate-300 text-sm">Wrong</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onNext}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
          >
            View Detailed Report
          </Button>
          <Button 
            onClick={onNewBattle}
            variant="outline"
            className="w-full text-white border-slate-600"
          >
            Start New Battle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
