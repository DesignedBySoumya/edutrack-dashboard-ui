
import { useState } from "react";

interface FocusRitualProps {
  onNext: () => void;
}

const FocusRitual = ({ onNext }: FocusRitualProps) => {
  const [step, setStep] = useState<'breathing' | 'affirmation' | 'ready'>('breathing');
  const [breathCount, setBreatheCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const startBreathing = () => {
    setIsBreathing(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBreatheCount(count);
      if (count >= 5) {
        clearInterval(interval);
        setIsBreathing(false);
        setTimeout(() => setStep('affirmation'), 1000);
      }
    }, 2000); // 2 seconds per breath cycle
  };

  const affirmations = [
    "I study not for marks. I study to dominate.",
    "I may not be fast today, but I will not stop.",
    "I am in defense. I am building my mind."
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-12 shadow-2xl text-center">
          <h2 className="text-3xl font-black text-white mb-8">
            🧘‍♂️ PRE-STUDY FOCUS RITUAL
          </h2>
          
          {step === 'breathing' && (
            <div>
              <div className="mb-8">
                <div className="text-6xl mb-4">🫁</div>
                <p className="text-slate-300 text-lg mb-6">
                  Close eyes. Breathe deeply. Center yourself.
                </p>
                {!isBreathing && (
                  <button
                    onClick={startBreathing}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
                  >
                    Begin Breathing Exercise
                  </button>
                )}
                {isBreathing && (
                  <div className="space-y-4">
                    <div className="text-2xl text-white font-bold">
                      Breath {breathCount}/5
                    </div>
                    <div className="text-lg text-slate-300">
                      {breathCount % 2 === 1 ? "Inhale... Count 5" : "Exhale... Count 5"}
                    </div>
                    <div className="w-24 h-24 mx-auto border-4 border-blue-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'affirmation' && (
            <div>
              <div className="text-4xl mb-6">💭</div>
              <h3 className="text-2xl font-bold text-white mb-6">Affirmation</h3>
              <div className="space-y-4 mb-8">
                {affirmations.map((affirmation, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-200 text-lg font-medium italic">
                      "{affirmation}"
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep('ready')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                I ACCEPT THESE TRUTHS
              </button>
            </div>
          )}

          {step === 'ready' && (
            <div>
              <div className="text-6xl mb-6">🎧</div>
              <h3 className="text-2xl font-bold text-white mb-6">Focus Mode Activated</h3>
              <div className="bg-slate-700/50 rounded-xl p-6 mb-8">
                <p className="text-slate-300 mb-4">
                  🎵 Ambient focus music is now playing
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-8 bg-orange-400 rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-orange-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-10 bg-orange-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-4 bg-orange-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-2 h-7 bg-orange-400 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
              <button
                onClick={onNext}
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-xl font-black text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                🔒 START FOCUS SESSION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusRitual;
