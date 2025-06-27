
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Eye, Clock, BookOpen, AlertCircle } from "lucide-react";

interface EnhancedStudySessionProps {
  sessionData: any;
  updateSessionData: (data: any) => void;
  onNext: () => void;
}

const EnhancedStudySession = ({ sessionData, updateSessionData, onNext }: EnhancedStudySessionProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [showFocusOverlay, setShowFocusOverlay] = useState(false);
  const [focusBreaks, setFocusBreaks] = useState(0);
  const [learningNotes, setLearningNotes] = useState('');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const lastActiveTime = useRef(Date.now());

  const smartResources = sessionData.smartResources || [];
  const currentResource = smartResources[currentResourceIndex];
  const targetMinutes = sessionData.targetHours * 60;

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowFocusOverlay(true);
      } else {
        lastActiveTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Timer and focus tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !document.hidden) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
        
        // Show reflection prompt every 20 minutes
        if (timeElapsed > 0 && timeElapsed % 1200 === 0) {
          setShowFocusOverlay(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeElapsed]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return Math.min((timeElapsed / (targetMinutes * 60)) * 100, 100);
  };

  const renderYouTubePlayer = (resource: any) => {
    const videoId = resource.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
    if (!videoId) return null;

    return (
      <div className="relative bg-black rounded-xl overflow-hidden">
        <iframe
          ref={videoRef}
          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&autoplay=0`}
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Custom overlay controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-sm">{resource.title}</span>
            </div>
            <div className="text-sm">
              Chapter {currentChapter + 1} of {resource.chapters?.length || 1}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPDFViewer = (resource: any) => {
    return (
      <div className="bg-slate-800 rounded-xl p-6 text-center">
        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-white text-xl mb-2">PDF Viewer</h3>
        <p className="text-slate-400 mb-4">Enhanced PDF reader with focus mode</p>
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Open in Focus Reader
        </a>
      </div>
    );
  };

  const nextResource = () => {
    if (currentResourceIndex < smartResources.length - 1) {
      setCurrentResourceIndex(prev => prev + 1);
      setCurrentChapter(0);
    }
  };

  const previousResource = () => {
    if (currentResourceIndex > 0) {
      setCurrentResourceIndex(prev => prev - 1);
      setCurrentChapter(0);
    }
  };

  const handleEndSession = () => {
    setIsActive(false);
    updateSessionData({ 
      studyTime: timeElapsed,
      learningNotes,
      focusMetrics: {
        tabSwitches: tabSwitchCount,
        focusBreaks,
        totalResources: smartResources.length,
        completedResources: currentResourceIndex + 1
      }
    });
    onNext();
  };

  const targetReached = timeElapsed >= (targetMinutes * 60);

  return (
    <div className="min-h-screen p-4">
      {/* Focus Overlay */}
      {showFocusOverlay && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Focus Check</h3>
            <p className="text-slate-300 mb-6">
              {tabSwitchCount > 0 
                ? "Distraction detected. Remember: you're building focus, not consuming content."
                : "You've been learning for 20 minutes. Take a moment to reflect."
              }
            </p>
            <textarea
              placeholder="What's one key thing you've learned so far?"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white mb-4 resize-none"
              rows={3}
            />
            <button
              onClick={() => {
                setShowFocusOverlay(false);
                setFocusBreaks(prev => prev + 1);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Return to Learning
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header with enhanced metrics */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-white">
                🧠 {sessionData.subject} - {sessionData.topic}
              </h2>
              <p className="text-slate-300">
                Resource {currentResourceIndex + 1} of {smartResources.length} • Energy: {sessionData.energyLevel}%
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono text-white font-bold">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-slate-400">
                Target: {targetMinutes}m
              </div>
            </div>
          </div>
          
          {/* Enhanced progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Session Progress</span>
              <span>{Math.floor(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  targetReached ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Focus metrics */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-slate-300">Focus Score: {Math.max(0, 100 - (tabSwitchCount * 10))}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">Deep Work: {Math.floor(timeElapsed / 60)}m</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main content area */}
          <div className="xl:col-span-3">
            {currentResource && (
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {currentResource.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={previousResource}
                      disabled={currentResourceIndex === 0}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextResource}
                      disabled={currentResourceIndex === smartResources.length - 1}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {currentResource.type === 'youtube' && renderYouTubePlayer(currentResource)}
                {currentResource.type === 'pdf' && renderPDFViewer(currentResource)}
              </div>
            )}
          </div>

          {/* Enhanced sidebar */}
          <div className="space-y-6">
            {/* Session controls */}
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
                  {isActive ? '⏸️ Pause Session' : '▶️ Resume Session'}
                </button>
                
                <button
                  onClick={() => setShowFocusOverlay(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  🧠 Reflection Break
                </button>
              </div>
            </div>

            {/* Learning notes */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📝 Live Insights</h3>
              <textarea
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
                placeholder="Key concepts, breakthrough moments, confusions..."
                className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-orange-400 focus:outline-none resize-none text-sm"
              />
            </div>

            {/* Complete session */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🏁 Session Status</h3>
              
              {targetReached ? (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                  <p className="text-green-200 text-sm">✅ Target achieved! Ready for deeper reflection.</p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <p className="text-blue-200 text-sm">
                    🎯 {Math.ceil((targetMinutes * 60 - timeElapsed) / 60)} minutes to target
                  </p>
                </div>
              )}
              
              <button
                onClick={handleEndSession}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-black transition-colors"
              >
                END SESSION & REFLECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudySession;
