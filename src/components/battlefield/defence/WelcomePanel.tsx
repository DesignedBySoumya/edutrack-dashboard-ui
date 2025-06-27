
interface WelcomePanelProps {
  onNext: () => void;
}

const WelcomePanel = ({ onNext }: WelcomePanelProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-3xl p-12 shadow-2xl">
          <h1 className="text-5xl font-black text-white mb-6">
            🛡️ WELCOME TO DEFENSE MODE
          </h1>
          
          <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
            <div className="flex items-center text-xl text-slate-200">
              <span className="text-orange-400 mr-4 text-2xl">🎯</span>
              <span><strong>Objective:</strong> Learn the subject with full clarity, no panic, no distractions.</span>
            </div>
            <div className="flex items-center text-xl text-slate-200">
              <span className="text-orange-400 mr-4 text-2xl">🧱</span>
              <span><strong>Foundation</strong> → <strong>Focus</strong> → <strong>Forward</strong></span>
            </div>
            <div className="flex items-center text-xl text-slate-200">
              <span className="text-orange-400 mr-4 text-2xl">📍</span>
              <span>You have 2 days. <strong className="text-white">Make it count.</strong></span>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 mb-8">
            <p className="text-red-200 text-lg font-medium">
              ⚠️ You cannot skip steps. You cannot switch modes without permission.
            </p>
          </div>

          <button
            onClick={onNext}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xl px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            BEGIN MISSION SETUP
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;
