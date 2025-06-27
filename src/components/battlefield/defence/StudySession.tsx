
import { useState, useEffect } from "react";

interface StudySessionProps {
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const StudySession = ({ sessionData, updateSessionData, onNext }: StudySessionProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const targetMinutes = sessionData.targetHours * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return Math.min((timeElapsed / (targetMinutes * 60)) * 100, 100);
  };

  const handleEndSession = () => {
    setIsActive(false);
    updateSessionData({ 
      studyTime: timeElapsed,
      notes: notes
    });
    onNext();
  };

  const targetReached = timeElapsed >= (targetMinutes * 60);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                📚 {sessionData.subject} - {sessionData.topic}
              </h2>
              <p className="text-slate-300">Target: {sessionData.targetHours}h | Energy: {sessionData.energyLevel}%</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono text-white font-bold">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-slate-400">
                {Math.floor(timeElapsed / 60)} / {targetMinutes} minutes
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  targetReached ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Study Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resources */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">📖 Study Resources</h3>
              <div className="space-y-3">
                {sessionData.resources.map((resource: string, index: number) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-200">{resource}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-green-400 hover:text-green-300 text-sm">
                        ✅ Completed
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                        ⏸️ In Progress
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-sm">
                        ❌ Confused
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Notes & Controls */}
          <div className="space-y-6">
            {/* Session Controls */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">⚡ Session Control</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    isActive 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isActive ? '⏸️ Pause Timer' : '▶️ Resume Timer'}
                </button>
                
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  📝 {showNotes ? 'Hide' : 'Show'} Quick Notes
                </button>
              </div>
            </div>

            {/* Quick Notes */}
            {showNotes && (
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📓 Quick Insights</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Type only the ideas you want your future self to remember.
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key insights, confusions, breakthrough moments..."
                  className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none resize-none text-sm"
                />
              </div>
            )}

            {/* End Session */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🏁 Complete Session</h3>
              {targetReached ? (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                  <p className="text-green-200 text-sm">✅ Target time reached! Great work.</p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                  <p className="text-yellow-200 text-sm">
                    ⏰ {Math.ceil((targetMinutes * 60 - timeElapsed) / 60)} minutes to target
                  </p>
                </div>
              )}
              
              <button
                onClick={handleEndSession}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-black transition-colors"
              >
                END SESSION & LOG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
