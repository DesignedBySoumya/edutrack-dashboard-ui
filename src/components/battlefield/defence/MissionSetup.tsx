
import { useState } from "react";

interface MissionSetupProps {
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const MissionSetup = ({ sessionData, updateSessionData, onNext }: MissionSetupProps) => {
  const [subject, setSubject] = useState(sessionData.subject || '');
  const [unit, setUnit] = useState(sessionData.unit || '');
  const [topic, setTopic] = useState(sessionData.topic || '');
  const [targetHours, setTargetHours] = useState(sessionData.targetHours || 2);
  const [pyqRelevance, setPyqRelevance] = useState(sessionData.pyqRelevance || 3);
  const [energyLevel, setEnergyLevel] = useState(sessionData.energyLevel || 50);

  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const getUnits = (subject: string) => {
    const units: Record<string, string[]> = {
      'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
      'Chemistry': ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
      'Mathematics': ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Statistics'],
      'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Biology']
    };
    return units[subject] || [];
  };

  const handleNext = () => {
    updateSessionData({
      subject,
      unit,
      topic,
      targetHours,
      pyqRelevance,
      energyLevel
    });
    onNext();
  };

  const isComplete = subject && unit && topic;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            🧭 MISSION SETUP
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Select Your Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
              >
                <option value="">Choose Subject</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {subject && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Unit</label>
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                >
                  <option value="">Choose Unit</option>
                  {getUnits(subject).map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            )}

            {unit && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter specific topic..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                🎯 Target Hours: {targetHours}h
              </label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.5h</span>
                <span>4h</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                📈 PYQ Relevance: {'⭐'.repeat(pyqRelevance)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={pyqRelevance}
                onChange={(e) => setPyqRelevance(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Low</span>
                <span>High Frequency</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                🔥 Mental Energy Level: {energyLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {pyqRelevance >= 4 && (
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                <p className="text-green-200 text-sm">
                  💡 High PYQ relevance? Learn deeply.
                </p>
              </div>
            )}

            {energyLevel < 50 && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  🐌 Low energy today? Go slow, but <strong>don't skip</strong>. Strategy first, speed later.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!isComplete}
            className={`w-full mt-8 py-4 rounded-xl font-black text-lg transition-all duration-300 ${
              isComplete 
                ? 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            PROCEED TO RESOURCES
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionSetup;
