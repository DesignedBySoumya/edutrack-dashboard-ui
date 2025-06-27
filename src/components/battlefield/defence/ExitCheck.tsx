
interface ExitCheckProps {
  sessionData: any;
  onReturnToDefense: () => void;
}

const ExitCheck = ({ sessionData, onReturnToDefense }: ExitCheckProps) => {
  const formatStudyTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return minutes;
  };

  const checklistItems = [
    {
      label: 'Watched/Read at least 90 mins',
      completed: formatStudyTime(sessionData.studyTime) >= 90,
      icon: '📚'
    },
    {
      label: 'Logged 2+ learnings',
      completed: sessionData.learnings && sessionData.learnings.split('.').filter(s => s.trim()).length >= 2,
      icon: '🧠'
    },
    {
      label: 'Logged 1+ confusion to solve later',
      completed: sessionData.confusions && sessionData.confusions.trim().length > 0,
      icon: '❓'
    },
    {
      label: 'Mental Energy: 😐 or above',
      completed: sessionData.energyAfter >= 50,
      icon: '🔋'
    },
    {
      label: 'Topic Marked as 🟢 or 🟡',
      completed: sessionData.topicStatus === 'ready' || sessionData.topicStatus === 'half-cooked',
      icon: '📌'
    }
  ];

  const allCompleted = checklistItems.every(item => item.completed);
  const completedCount = checklistItems.filter(item => item.completed).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-2 text-center">
            🚨 EXIT READINESS CHECK
          </h2>
          
          <p className="text-slate-300 text-center mb-8">
            Are you truly ready for Attack Mode?
          </p>

          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Checklist:</h3>
            {checklistItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center p-4 rounded-lg transition-all ${
                  item.completed 
                    ? 'bg-green-900/30 border border-green-700/50' 
                    : 'bg-slate-700/30 border border-slate-600/50'
                }`}
              >
                <span className="text-2xl mr-4">{item.icon}</span>
                <span className={`flex-1 ${item.completed ? 'text-green-200' : 'text-slate-300'}`}>
                  {item.label}
                </span>
                <span className="text-2xl">
                  {item.completed ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-slate-700/50 rounded-lg px-6 py-3">
              <span className="text-slate-300">Readiness Score:</span>
              <span className={`font-bold text-2xl ml-3 ${
                allCompleted ? 'text-green-400' : 
                completedCount >= 3 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {completedCount}/5
              </span>
            </div>
          </div>

          {allCompleted ? (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-6 mb-6">
                <p className="text-green-200 text-center font-semibold">
                  🎯 Excellent! You have built a solid foundation.
                  <br />
                  You are ready to move into strategic practice.
                </p>
              </div>
              
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105">
                🔴 PROCEED TO ATTACK MODE
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6 mb-6">
                <p className="text-yellow-200 text-center">
                  ⚠️ Defense foundation incomplete.
                  <br />
                  <strong>Stay disciplined. Complete the work.</strong>
                </p>
              </div>
              
              <button 
                onClick={onReturnToDefense}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg transition-all duration-300"
              >
                🛡️ STAY IN DEFENSE MODE
              </button>
            </div>
          )}

          <div className="mt-8 p-6 bg-slate-700/30 rounded-xl">
            <p className="text-slate-300 text-center italic">
              "Defense is not weakness.<br />
              It is <strong className="text-white">discipline without applause</strong>.<br />
              Master this — and you'll never fear the exam again."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitCheck;
