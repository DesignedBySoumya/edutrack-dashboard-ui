import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefenseMode from "@/components/battlefield/defence/DefenseMode";

const Index = () => {
  const [enterDefense, setEnterDefense] = useState(false);
  const navigate = useNavigate();

  if (enterDefense) {
    return <DefenseMode />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-7xl mx-auto w-full">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 lg:mb-6 tracking-tight caret-transparent select-none">
            ⚔️ BATTLEFIELD
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-medium mb-2">
            "This is not where toppers win."
          </p>
          <p className="text-xl sm:text-2xl text-slate-100 font-bold">
            "This is where losers <span className="text-orange-400">transform into contenders</span>."
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Defense Mode */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 lg:p-8 flex flex-col h-full">
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 caret-transparent select-none">
                  🛡️ DEFENSE
                </h2>
                <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6">
                  Build your <strong className="text-white">mental weapons</strong>, strategy, energy, and rituals.
                </p>
              </div>
              
              <div className="text-left space-y-3">
                <div className="flex items-center text-slate-200">
                  <span className="text-blue-400 mr-3">🧱</span>
                  <span className="text-sm lg:text-base">Foundation over speed</span>
                </div>
                <div className="flex items-center text-slate-200">
                  <span className="text-blue-400 mr-3">🎯</span>
                  <span className="text-sm lg:text-base">Pure focus, zero distractions</span>
                </div>
                <div className="flex items-center text-slate-200">
                  <span className="text-blue-400 mr-3">🧠</span>
                  <span className="text-sm lg:text-base">Self-respect through discipline</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEnterDefense(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl mt-6"
            >
              ENTER DEFENSE MODE
            </button>
          </div>

          {/* Attack Mode */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 lg:p-8 flex flex-col h-full">
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 caret-transparent select-none">
                  ⚔️ ATTACK
                </h2>
                <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6">
                  Master <strong className="text-white">MCQs with confidence</strong>, reflection, and beast-like intensity.
                </p>
              </div>
              
              <div className="text-left space-y-3">
                <div className="flex items-center text-slate-200">
                  <span className="text-red-400 mr-3">🔥</span>
                  <span className="text-sm lg:text-base">Timed battle sessions</span>
                </div>
                <div className="flex items-center text-slate-200">
                  <span className="text-red-400 mr-3">🎯</span>
                  <span className="text-sm lg:text-base">Confidence tracking & reflection</span>
                </div>
                <div className="flex items-center text-slate-200">
                  <span className="text-red-400 mr-3">⚡</span>
                  <span className="text-sm lg:text-base">Beast-mode streaks & gamification</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/battlefield/attack')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-black text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl mt-6"
            >
              ENTER ATTACK MODE
            </button>
          </div>

          {/* War Mode */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 lg:p-8 flex flex-col h-full md:col-span-2 lg:col-span-1">
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 caret-transparent select-none">
                  🏹 WAR
                </h2>
                <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6">
                  Prepare like a <strong className="text-white">warrior</strong>. Mock battles and strategic training.
                </p>
              </div>
              
              <div className="text-left space-y-3">
                <div className="flex items-center text-slate-200">
                  <span className="text-orange-400 mr-3">🎯</span>
                  <span className="text-sm lg:text-base">Full-length & subject-wise drills</span>
                </div>
                <div className="flex items-center text-slate-200">
                  <span className="text-orange-400 mr-3">⚔️</span>
                  <span className="text-sm lg:text-base">Exam pressure training environment</span>
                </div>
                <div className="flex items-center text-slate-200">
                  <span className="text-orange-400 mr-3">📊</span>
                  <span className="text-sm lg:text-base">Expose weaknesses before battle</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/battlefield/war')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl mt-6"
            >
              ENTER WAR MODE
            </button>
          </div>
        </div>
        
        <p className="text-slate-400 text-xs sm:text-sm">
          "Defense is not weakness. Attack is not aggression. War is not violence. All are <strong>discipline without applause</strong>."
        </p>
      </div>
    </div>
  );
};

export default Index;
