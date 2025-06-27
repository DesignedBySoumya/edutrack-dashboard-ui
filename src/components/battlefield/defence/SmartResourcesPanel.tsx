
import { useState } from "react";
import { Clock, Play, FileText, Youtube, ExternalLink } from "lucide-react";

interface SmartResource {
  id: string;
  url: string;
  type: 'youtube' | 'pdf' | 'link';
  title: string;
  estimatedTime: number; // in minutes
  chapters?: { title: string; timestamp: number }[];
  progress: number; // 0-100
}

interface SmartResourcesPanelProps {
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const SmartResourcesPanel = ({ sessionData, updateSessionData, onNext }: SmartResourcesPanelProps) => {
  const [resources, setResources] = useState<SmartResource[]>(sessionData.smartResources || []);
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const detectResourceType = (url: string): 'youtube' | 'pdf' | 'link' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('.pdf') || url.toLowerCase().includes('pdf')) return 'pdf';
    return 'link';
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const estimateWatchTime = (type: string, url: string): number => {
    // Mock estimation - in real app, would use YouTube API or PDF analysis
    if (type === 'youtube') return 45; // Default YouTube video estimate
    if (type === 'pdf') return 30; // Default PDF reading time
    return 20; // Default link reading time
  };

  const processResource = async (url: string) => {
    setIsProcessing(true);
    
    const type = detectResourceType(url);
    const videoId = type === 'youtube' ? extractYouTubeId(url) : null;
    
    // Mock processing - in real app would call APIs
    const newResource: SmartResource = {
      id: Date.now().toString(),
      url,
      type,
      title: type === 'youtube' ? `YouTube Video ${videoId}` : 
             type === 'pdf' ? 'PDF Document' : 'Learning Resource',
      estimatedTime: estimateWatchTime(type, url),
      chapters: type === 'youtube' ? [
        { title: 'Introduction', timestamp: 0 },
        { title: 'Main Concept', timestamp: 300 },
        { title: 'Examples', timestamp: 900 }
      ] : undefined,
      progress: 0
    };

    setResources(prev => [...prev, newResource]);
    setNewResourceUrl('');
    setIsProcessing(false);
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const getTotalTime = () => {
    return resources.reduce((total, resource) => total + resource.estimatedTime, 0);
  };

  const handleNext = () => {
    updateSessionData({ smartResources: resources });
    onNext();
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'pdf': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <ExternalLink className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            🧠 SMART CONTENT HUB
          </h2>
          
          <div className="mb-6">
            <p className="text-slate-300 mb-4">Add YouTube, PDF, or any learning resource</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
                placeholder="Paste YouTube URL, PDF link, or any resource..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && processResource(newResourceUrl)}
              />
              <button
                onClick={() => processResource(newResourceUrl)}
                disabled={!newResourceUrl.trim() || isProcessing}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Add'}
              </button>
            </div>
          </div>

          {resources.length > 0 && (
            <div className="mb-6">
              <div className="bg-slate-700/50 rounded-xl p-6 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400 font-semibold">📊 Learning Plan:</span>
                  <span className="text-white font-bold text-lg">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {Math.floor(getTotalTime() / 60)}h {getTotalTime() % 60}m
                  </span>
                </div>
                <div className="text-slate-300 text-sm">
                  📚 {resources.length} resources • Auto-organized for optimal learning
                </div>
              </div>

              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <div key={resource.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.type)}
                        <div>
                          <h3 className="text-slate-200 font-semibold">{resource.title}</h3>
                          <p className="text-slate-400 text-sm capitalize">
                            {resource.type} • {resource.estimatedTime}m
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeResource(resource.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                    
                    {resource.chapters && (
                      <div className="bg-slate-800/50 rounded-lg p-3 mb-2">
                        <p className="text-slate-400 text-xs mb-2">Auto-detected chapters:</p>
                        <div className="flex flex-wrap gap-2">
                          {resource.chapters.map((chapter, i) => (
                            <span key={i} className="bg-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                              {chapter.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${resource.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-400 text-sm">{resource.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6 mb-6">
            <h3 className="text-blue-200 font-semibold mb-3">🎯 Smart Learning Protocol:</h3>
            <ul className="text-blue-200 text-sm space-y-2">
              <li>• Content auto-organized by difficulty and PYQ relevance</li>
              <li>• Distraction-free players with chapter navigation</li>
              <li>• Progress tracking with smart resume functionality</li>
              <li>• Focus overlays to maintain concentration</li>
            </ul>
          </div>

          <button
            onClick={handleNext}
            disabled={resources.length === 0}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 ${
              resources.length > 0
                ? 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            START FOCUS RITUAL →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartResourcesPanel;
