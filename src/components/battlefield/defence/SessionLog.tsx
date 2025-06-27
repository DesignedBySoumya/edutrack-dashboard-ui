
import { useState } from "react";

interface SessionLogProps {
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const SessionLog = ({ sessionData, updateSessionData, onNext }: SessionLogProps) => {
  const [learnings, setLearnings] = useState('');
  const [confusions, setConfusions] = useState('');
  const [reviewItems, setReviewItems] = useState<string[]>([]);
  const [newReviewItem, setNewReviewItem] = useState('');
  const [energyAfter, setEnergyAfter] = useState(50);
  const [topicStatus, setTopicStatus] = useState('');

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const addReviewItem = () => {
    if (newReviewItem.trim()) {
      setReviewItems([...reviewItems, newReviewItem.trim()]);
      setNewReviewItem('');
    }
  };

  const removeReviewItem = (index: number) => {
    setReviewItems(reviewItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    updateSessionData({
      learnings,
      confusions,
      reviewItems,
      energyAfter,
      topicStatus
    });
    
    // Save to localStorage (mock persistence)
    const logEntry = {
      date: new Date().toISOString(),
      subject: sessionData.subject,
      topic: sessionData.topic,
      studyTime: sessionData.studyTime,
      learnings,
      confusions,
      topicStatus
    };
    
    const existingLogs = JSON.parse(localStorage.getItem('defenseLogs') || '[]');
    localStorage.setItem('defenseLogs', JSON.stringify([...existingLogs, logEntry]));
    
    onNext();
  };

  const isComplete = learnings.trim() && topicStatus;
  const consecutiveDays = 3; // Mock streak

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-2 text-center">
            🧠 DEBRIEF TIME
          </h2>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-slate-700/50 rounded-lg px-4 py-2">
              <span className="text-slate-300">Session completed:</span>
              <span className="text-orange-400 font-bold ml-2">
                {formatStudyTime(sessionData.studyTime)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Learnings */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                🗒️ What did you learn today?
              </label>
              <textarea
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="Key concepts, formulas, insights that clicked..."
                className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none resize-none"
              />
            </div>

            {/* Confusions */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                ❌ What confused or distracted you?
              </label>
              <textarea
                value={confusions}
                onChange={(e) => setConfusions(e.target.value)}
                placeholder="Concepts that need clarification, distractions faced..."
                className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none resize-none"
              />
            </div>

            {/* Review Items */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                🚧 What must be reviewed tomorrow?
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newReviewItem}
                  onChange={(e) => setNewReviewItem(e.target.value)}
                  placeholder="Add item to review..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addReviewItem()}
                />
                <button
                  onClick={addReviewItem}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Add
                </button>
              </div>
              {reviewItems.length > 0 && (
                <div className="space-y-2">
                  {reviewItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-2">
                      <span className="text-slate-200 text-sm">{item}</span>
                      <button
                        onClick={() => removeReviewItem(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Energy Level After */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                🔋 Energy Level After Session
              </label>
              <div className="flex items-center gap-4">
                <span className="text-2xl">😴</span>
                <span className="text-2xl">😐</span>
                <span className="text-2xl">😎</span>
                <div className="flex-1 ml-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyAfter}
                    onChange={(e) => setEnergyAfter(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="text-center text-slate-400 text-sm mt-1">{energyAfter}%</div>
                </div>
              </div>
            </div>

            {/* Topic Status */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                📌 Mark this topic as:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTopicStatus('ready')}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    topicStatus === 'ready' 
                      ? 'bg-green-600 text-white border-2 border-green-400' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🟢 Ready
                </button>
                <button
                  onClick={() => setTopicStatus('half-cooked')}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    topicStatus === 'half-cooked' 
                      ? 'bg-yellow-600 text-white border-2 border-yellow-400' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🟡 Half-Cooked
                </button>
                <button
                  onClick={() => setTopicStatus('needs-work')}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    topicStatus === 'needs-work' 
                      ? 'bg-red-600 text-white border-2 border-red-400' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🔴 Needs More Work
                </button>
              </div>
            </div>
          </div>

          {/* Streak Display */}
          {consecutiveDays > 0 && (
            <div className="mt-6 bg-green-900/20 border border-green-700/50 rounded-lg p-4">
              <p className="text-green-200 text-center">
                🔥 {consecutiveDays} Days Consecutive Defense Logs Saved ✅
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full mt-8 py-4 rounded-xl font-black text-lg transition-all duration-300 ${
              isComplete 
                ? 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            📝 SAVE LOG & PROCEED
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionLog;
