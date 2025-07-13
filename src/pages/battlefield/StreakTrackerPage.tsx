import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StreakTracker from "@/components/battlefield/attack/StreakTracker";

const StreakTrackerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/battlefield/attack")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attack Mode
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">🔥 Streak Tracker</h1>
            <p className="text-gray-400">Track your daily battle consistency</p>
          </div>
          <div className="w-[120px]"></div>
        </div>

        {/* Streak Tracker Component */}
        <StreakTracker />
      </div>
    </div>
  );
};

export default StreakTrackerPage; 