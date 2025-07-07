import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface DefenseSetupProps {
  examId: number;
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const DefenseSetup = ({ examId, sessionData, updateSessionData, onNext }: DefenseSetupProps) => {
  // State for subjects and chapters
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(sessionData.subjectId || '');
  const [chapters, setChapters] = useState<{ id: number; name: string }[]>([]);
  const [selectedChapter, setSelectedChapter] = useState(sessionData.chapterId || '');
  const [topic, setTopic] = useState(sessionData.topic || '');
  const [targetHours, setTargetHours] = useState(sessionData.targetHours || 2);
  const [pyqRelevance, setPyqRelevance] = useState(sessionData.pyqRelevance || 3);
  const [energyLevel, setEnergyLevel] = useState(sessionData.energyLevel || 50);

  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // Fetch subjects when examId changes
  useEffect(() => {
    if (!examId) return;
    setLoadingSubjects(true);
    setSubjects([]);
    setSelectedSubject('');
    setChapters([]);
    setSelectedChapter('');
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('exam_id', examId);
      if (!error && data) setSubjects(data);
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, [examId]);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setChapters([]);
      setSelectedChapter('');
      return;
    }
    setLoadingChapters(true);
    setChapters([]);
    setSelectedChapter('');
    const fetchChapters = async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('id, name')
        .eq('subject_id', selectedSubject);
      if (!error && data) setChapters(data);
      setLoadingChapters(false);
    };
    fetchChapters();
  }, [selectedSubject]);

  // Reset chapter if subject changes
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
    setSelectedChapter('');
  };

  // Proceed button handler
  const handleProceed = () => {
    updateSessionData({
      examId,
      subjectId: selectedSubject,
      chapterId: selectedChapter,
      topic,
      targetHours,
      pyqRelevance,
      energyLevel,
    });
    onNext();
  };

  const isComplete = selectedSubject && selectedChapter && topic;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            🛡️ DEFENSE SETUP
          </h2>
          <div className="space-y-6">
            {/* Subject Dropdown */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Select Subject</label>
              {loadingSubjects ? (
                <div className="text-slate-400">Loading subjects...</div>
              ) : (
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                >
                  <option value="">Choose Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>
            {/* Chapter Dropdown */}
            {selectedSubject && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Select Chapter</label>
                {loadingChapters ? (
                  <div className="text-slate-400">Loading chapters...</div>
                ) : (
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                  >
                    <option value="">Choose Chapter</option>
                    {chapters.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
            {/* Topic Input */}
            {selectedChapter && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter any topic you want to study..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                />
              </div>
            )}
            {/* Target Hours Slider */}
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
            {/* PYQ Relevance Slider */}
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
            {/* Energy Level Slider */}
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
            {/* Tips/Alerts */}
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
            onClick={handleProceed}
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

export default DefenseSetup; 