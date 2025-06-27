
import { useState } from "react";

interface ResourcesPanelProps {
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const ResourcesPanel = ({ sessionData, updateSessionData, onNext }: ResourcesPanelProps) => {
  const [resources, setResources] = useState<string[]>(sessionData.resources || []);
  const [newResource, setNewResource] = useState('');

  const addResource = () => {
    if (newResource.trim()) {
      const updated = [...resources, newResource.trim()];
      setResources(updated);
      setNewResource('');
    }
  };

  const removeResource = (index: number) => {
    const updated = resources.filter((_, i) => i !== index);
    setResources(updated);
  };

  const handleNext = () => {
    updateSessionData({ resources });
    onNext();
  };

  const getTotalEstimatedTime = () => {
    // Mock calculation based on number of resources
    return resources.length > 0 ? `${resources.length * 45}m` : '0m';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            🎥 SCOUTING RESOURCES
          </h2>
          
          <div className="mb-6">
            <p className="text-slate-300 mb-4">Drop your Playlist | PDF | Book Chapter</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                placeholder="YouTube playlist, PDF name, or book chapter..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addResource()}
              />
              <button
                onClick={addResource}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {resources.length > 0 && (
            <div className="mb-6">
              <div className="bg-slate-700/50 rounded-xl p-6 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400 font-semibold">✅ Estimated Study Time:</span>
                  <span className="text-white font-bold text-lg">{getTotalEstimatedTime()}</span>
                </div>
                <div className="text-slate-300 text-sm">
                  📌 Resources added: {resources.length}
                </div>
              </div>

              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                    <span className="text-slate-200">{resource}</span>
                    <button
                      onClick={() => removeResource(index)}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-blue-200 font-semibold mb-3">🎯 Focus Protocol:</h3>
            <ul className="text-blue-200 text-sm space-y-2">
              <li>• Focus on understanding. Write no notes yet.</li>
              <li>• Use pen in hand. Pause. Think. Replay only once.</li>
              <li>• If confused, mark timestamp - don't loop endlessly.</li>
            </ul>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105"
          >
            PROCEED TO FOCUS RITUAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPanel;
