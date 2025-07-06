
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play, Pause, SkipForward, Maximize, Minimize, Music, Settings, ArrowLeft, Bell, BellOff, PlayCircle, PauseCircle, Volume2, VolumeX, Link, CloudRain } from 'lucide-react';
import { usePomodoroSession } from '@/hooks/usePomodoroSession';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: number;
  name: string;
  progress: number;
  timeSpent: string;
  color: string;
  isPlaying: boolean;
  chapters?: any[];
}

interface StudyStats {
  timeSpentToday: number;
  timeSpentTotal: number;
  studyStreak: number;
  completedChapters: number;
  totalChapters: number;
}

interface StudySessionProps {
  subject: Subject;
  onBack: () => void;
  studyStats?: StudyStats;
}

// Flip Clock Components
const AnimatedCard = ({ animation, digit }: { animation: string; digit: string }) => {
  return(
    <div className={`flipCard ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const StaticCard = ({ position, digit }: { position: string; digit: string }) => {
  return(
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

const FlipUnitContainer = ({ digit, shuffle, unit }: { digit: number; shuffle: boolean; unit: string }) => {	
  // assign digit values
  let currentDigit: number = digit;
  let previousDigit: number = digit - 1;

  // to prevent a negative value
  if (unit !== 'hours') {
    previousDigit = previousDigit === -1 
      ? 59 
      : previousDigit;
  } else {
    previousDigit = previousDigit === -1 
      ? 23 
      : previousDigit;
  }

  // add zero and convert to string
  let currentDigitStr: string = currentDigit < 10 ? `0${currentDigit}` : currentDigit.toString();
  let previousDigitStr: string = previousDigit < 10 ? `0${previousDigit}` : previousDigit.toString();

  // shuffle digits
  const digit1 = shuffle 
    ? previousDigitStr 
    : currentDigitStr;
  const digit2 = !shuffle 
    ? previousDigitStr 
    : currentDigitStr;

  // shuffle animations
  const animation1 = shuffle 
    ? 'fold' 
    : 'unfold';
  const animation2 = !shuffle 
    ? 'fold' 
    : 'unfold';

  return(
    <div className={'flipUnitContainer'}>
      <StaticCard 
        position={'upperCard'} 
        digit={currentDigitStr} 
      />
      <StaticCard 
        position={'lowerCard'} 
        digit={previousDigitStr} 
      />
      <AnimatedCard 
        digit={digit1}
        animation={animation1}
      />
      <AnimatedCard 
        digit={digit2}
        animation={animation2}
      />
    </div>
  );
};

export const StudySession = ({ subject, onBack, studyStats }: StudySessionProps) => {
  const { toast } = useToast();
  
  // Timer settings state
  const [timerSettings, setTimerSettings] = useState({
    focusDuration: 25, // minutes
    breakDuration: 5,  // minutes
    longBreakDuration: 20, // minutes
    autoStartNext: false,
    soundNotifications: true
  });
  
  // Input field states for free typing
  const [inputValues, setInputValues] = useState({
    focusDuration: '25',
    breakDuration: '5',
    longBreakDuration: '20'
  });
  
  // Fullscreen and music states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [musicType, setMusicType] = useState<'lofi' | 'rain' | 'custom'>('lofi');
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  
  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  
  // Music tracks - Using working audio URLs
  const lofiTracks = [
    'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
    'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav'
  ];
  
  const rainSounds = [
    'https://www.soundjay.com/nature/sounds/rain-01.wav',
    'https://www.soundjay.com/nature/sounds/rain-02.wav',
    'https://www.soundjay.com/nature/sounds/rain-03.wav'
  ];

  // Fallback music options if the above don't work
  const fallbackTracks = [
    'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
    'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
  ];
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Flip clock states
  const [minutesFlip, setMinutesFlip] = useState(false);
  const [secondsFlip, setSecondsFlip] = useState(false);
  const [prevMinutes, setPrevMinutes] = useState(Math.floor(timerSettings.focusDuration));
  const [prevSeconds, setPrevSeconds] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState(Math.floor(timerSettings.focusDuration));
  const [displaySeconds, setDisplaySeconds] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusDuration * 60); // Use settings
  const [sessionCount, setSessionCount] = useState(1);
  const [sessionType, setSessionType] = useState<'focused' | 'break'>('focused');
  const [totalTimeToday, setTotalTimeToday] = useState(studyStats?.timeSpentToday || 0);
  const [resetClickCount, setResetClickCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Get current music tracks based on type
  const getCurrentTracks = () => {
    switch (musicType) {
      case 'rain':
        return rainSounds.length > 0 ? rainSounds : fallbackTracks;
      case 'custom':
        return customMusicUrl ? [customMusicUrl] : fallbackTracks;
      default:
        return lofiTracks.length > 0 ? lofiTracks : fallbackTracks;
    }
  };
  
  // Play notification sound
  const playNotificationSound = () => {
    if (timerSettings.soundNotifications) {
      try {
        // Create a simple notification sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Could not play notification sound:', error);
      }
    }
  };
  
  // Load saved settings from database on component mount
  useEffect(() => {
    const loadSettingsFromDB = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          // Fallback to localStorage if not authenticated
          const savedSettings = localStorage.getItem('pomodoroSettings');
          if (savedSettings) {
            try {
              const parsed = JSON.parse(savedSettings);
              setTimerSettings(parsed);
              // Update input values to match loaded settings
              setInputValues({
                focusDuration: parsed.focusDuration.toString(),
                breakDuration: parsed.breakDuration.toString(),
                longBreakDuration: parsed.longBreakDuration.toString()
              });
              if (!isActive) {
                setTimeLeft(parsed.focusDuration * 60);
                // Update display values for flip clock
                setDisplayMinutes(parsed.focusDuration);
                setDisplaySeconds(0);
                setPrevMinutes(parsed.focusDuration);
                setPrevSeconds(0);
              }
            } catch (error) {
              console.error('Error loading Pomodoro settings from localStorage:', error);
            }
          }
          return;
        }

        // Load settings from database
        const { data: dbSettings, error: dbError } = await supabase
          .from('user_timer_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (dbError) {
          console.error('Error loading settings from database:', dbError);
          // Fallback to localStorage
          const savedSettings = localStorage.getItem('pomodoroSettings');
          if (savedSettings) {
            try {
              const parsed = JSON.parse(savedSettings);
              setTimerSettings(parsed);
              // Update input values to match loaded settings
              setInputValues({
                focusDuration: parsed.focusDuration.toString(),
                breakDuration: parsed.breakDuration.toString(),
                longBreakDuration: parsed.longBreakDuration.toString()
              });
              if (!isActive) {
                setTimeLeft(parsed.focusDuration * 60);
                // Update display values for flip clock
                setDisplayMinutes(parsed.focusDuration);
                setDisplaySeconds(0);
                setPrevMinutes(parsed.focusDuration);
                setPrevSeconds(0);
              }
            } catch (error) {
              console.error('Error loading Pomodoro settings from localStorage:', error);
            }
          }
          return;
        }

        if (dbSettings) {
          const settings = {
            focusDuration: dbSettings.focus_duration,
            breakDuration: dbSettings.break_duration,
            longBreakDuration: dbSettings.long_break_duration,
            autoStartNext: dbSettings.auto_start_next,
            soundNotifications: dbSettings.sound_notifications
          };
          
          setTimerSettings(settings);
          // Update input values to match loaded settings
          setInputValues({
            focusDuration: settings.focusDuration.toString(),
            breakDuration: settings.breakDuration.toString(),
            longBreakDuration: settings.longBreakDuration.toString()
          });
          if (!isActive) {
            setTimeLeft(settings.focusDuration * 60);
            // Update display values for flip clock
            setDisplayMinutes(settings.focusDuration);
            setDisplaySeconds(0);
            setPrevMinutes(settings.focusDuration);
            setPrevSeconds(0);
          }
          
          // Also save to localStorage as backup
          localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        }
      } catch (error) {
        console.error('Error loading timer settings:', error);
      }
    };

    loadSettingsFromDB();
  }, []);
  
  // Use the Pomodoro session hook for database management
  const {
    activeSession,
    elapsedTime,
    isLoading: pomodoroLoading,
    startSession,
    endSession,
    resetSession
  } = usePomodoroSession(timerSettings);

  // Check if there's an active session for this subject
  const isActive = activeSession?.subjectId === subject.id;

  // Prevent auto-resume by clearing any existing session for this subject
  // Only run this once when component mounts, not when activeSession changes
  useEffect(() => {
    const clearExistingSession = async () => {
      if (activeSession && activeSession.subjectId === subject.id) {
        console.log('🔄 Clearing auto-resumed session to prevent auto-start');
        await endSession();
      }
    };
    clearExistingSession();
  }, []); // Only run on mount, not when activeSession changes

  // Update total time today when session is active
  useEffect(() => {
    if (isActive && elapsedTime > 0) {
      setTotalTimeToday(studyStats?.timeSpentToday + elapsedTime);
    }
  }, [isActive, elapsedTime, studyStats?.timeSpentToday]);

  // Auto-advance to next session when timer reaches 0
  useEffect(() => {
    if (isActive && timeLeft === 0) {
      // Play notification sound when session ends
      playNotificationSound();
      
      // Show session completion notification
      toast({
        title: `${sessionType === 'focused' ? 'Focus' : 'Break'} Session Complete!`,
        description: timerSettings.autoStartNext 
          ? "Starting next session..." 
          : "Session ended. Click play to start next session.",
      });
      
      if (timerSettings.autoStartNext) {
        handleSkip();
      } else {
        // Just end the current session without auto-starting next
        endSession();
      }
    }
  }, [isActive, timeLeft, timerSettings.autoStartNext, sessionType]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const newMinutes = Math.floor(newTime / 60);
          const newSeconds = newTime % 60;
          
          // Handle minutes flip
          if (newMinutes !== prevMinutes) {
            setMinutesFlip(true);
            setTimeout(() => {
              setMinutesFlip(false);
              setDisplayMinutes(newMinutes);
              setPrevMinutes(newMinutes);
            }, 600);
          }
          
          // Handle seconds flip
          if (newSeconds !== prevSeconds) {
            setSecondsFlip(true);
            setTimeout(() => {
              setSecondsFlip(false);
              setDisplaySeconds(newSeconds);
              setPrevSeconds(newSeconds);
            }, 600);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, prevMinutes, prevSeconds]);

  // Update display values when timer changes manually (reset, skip, etc.)
  useEffect(() => {
    const currentMinutes = Math.floor(timeLeft / 60);
    const currentSeconds = timeLeft % 60;
    
    if (!isActive) {
      setDisplayMinutes(currentMinutes);
      setDisplaySeconds(currentSeconds);
      setPrevMinutes(currentMinutes);
      setPrevSeconds(currentSeconds);
      setMinutesFlip(false);
      setSecondsFlip(false);
    }
  }, [timeLeft, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (isActive) {
      // Stop the session
      console.log('⏸️ Stopping session');
      await endSession();
    } else {
      // Start a new session
      console.log('▶️ Starting new session for subject:', subject.name);
      await startSession(subject.id, subject.name, sessionType);
    }
  };

  const handleReset = async () => {
    if (resetClickCount === 0) {
      setResetClickCount(1);
      setTimeout(() => setResetClickCount(0), 2000);
      setTimeLeft(sessionType === 'focused' ? timerSettings.focusDuration * 60 : timerSettings.breakDuration * 60);
      if (isActive) {
        await endSession();
      }
    } else {
      // Double reset - reset all
      setSessionCount(0);
      setTimeLeft(timerSettings.focusDuration * 60);
      if (isActive) {
        await endSession();
      }
      setSessionType('focused');
      setResetClickCount(0);
    }
  };

  const handleSkip = async () => {
    if (sessionType === 'focused') {
      // Switch to break
      setSessionType('break');
      // Long break after every 4 focus sessions (instead of 3)
      setTimeLeft(sessionCount % 4 === 0 ? timerSettings.longBreakDuration * 60 : timerSettings.breakDuration * 60);
    } else {
      // Switch to focus
      setSessionType('focused');
      setTimeLeft(timerSettings.focusDuration * 60);
      setSessionCount(prev => prev + 1);
    }
    if (isActive) {
      await endSession();
    }
  };

  const progress = sessionType === 'focused' 
    ? ((timerSettings.focusDuration * 60 - timeLeft) / (timerSettings.focusDuration * 60)) * 100
    : ((timerSettings.breakDuration * 60 - timeLeft) / (timerSettings.breakDuration * 60)) * 100;

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Music functionality
  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
      setIsMusicPlaying(false);
      toast({
        title: "Music Paused",
        description: "Background music has been paused",
      });
    } else {
      const tracks = getCurrentTracks();
      if (tracks.length === 0) {
        toast({
          title: "No Music Available",
          description: musicType === 'custom' ? "Please enter a valid music URL" : "No tracks available",
          variant: "destructive",
        });
        return;
      }

      // Create new audio element for better error handling
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      audioRef.current = new Audio(tracks[currentTrackIndex]);
      audioRef.current.loop = true;
      audioRef.current.volume = musicVolume;
      
      audioRef.current.addEventListener('ended', () => {
        // Play next track when current ends
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Music Error",
          description: "Failed to load music. Please check your URL or try a different track.",
          variant: "destructive",
        });
        setIsMusicPlaying(false);
        audioRef.current = null;
      });
      
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
        toast({
          title: "Music Started",
          description: `Now playing ${musicType === 'custom' ? 'custom track' : `${musicType} track ${currentTrackIndex + 1}`}`,
        });
      }).catch(err => {
        console.log('Error playing music:', err);
        toast({
          title: "Music Error",
          description: "Could not play music. Please check your URL or try again.",
          variant: "destructive",
        });
        audioRef.current = null;
      });
    }
  };

  const changeVolume = (newVolume: number) => {
    setMusicVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const nextTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentTrackIndex((prev) => (prev + 1) % getCurrentTracks().length);
      
      // Update audio source
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = getCurrentTracks()[(currentTrackIndex + 1) % getCurrentTracks().length];
          audioRef.current.volume = musicVolume;
          if (isMusicPlaying) {
            audioRef.current.play();
          }
        }
      }, 100);
    }
  };

  // Update audio when track changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.src = getCurrentTracks()[currentTrackIndex];
      audioRef.current.volume = musicVolume;
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Close music controls when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.music-controls')) {
        setShowMusicControls(false);
      }
    };

    if (showMusicControls) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMusicControls]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      const target = event.target as Element;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          event.preventDefault();
          handlePlayPause();
          break;
        case 'r':
          event.preventDefault();
          handleReset();
          break;
        case 's':
          event.preventDefault();
          handleSkip();
          break;
        case 'f':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          event.preventDefault();
          toggleMusic();
          break;
        case 'n':
          event.preventDefault();
          nextTrack();
          break;
        case 'escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          if (showMusicControls) {
            setShowMusicControls(false);
          }
          if (showSettings) {
            setShowSettings(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isActive, isFullscreen, showMusicControls, showSettings]);

  return (
    <div className="px-6 py-4" ref={fullscreenRef}>
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to subjects</span>
        </button>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pomodoro Timer Card */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-slate-800 relative">
          {/* Top Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-500 text-white text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center">
              {sessionCount}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-orange-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
              
              <div className="relative music-controls">
                <button
                  onClick={() => setShowMusicControls(!showMusicControls)}
                  className={`p-2 transition-colors rounded-lg hover:bg-slate-800 ${isMusicPlaying ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`}
                  title="Music Controls"
                >
                  <Music className="w-5 h-5" />
                </button>
                
                {/* Music Controls Dropdown */}
                {showMusicControls && (
                  <div className="absolute top-10 right-0 bg-[#2a2a2f] border border-slate-700 rounded-lg p-4 w-64 z-10 shadow-xl">
                    <div className="space-y-4">
                      {/* Music Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Music Type
                        </label>
                        <select
                          value={musicType}
                          onChange={(e) => {
                            setMusicType(e.target.value as 'lofi' | 'rain' | 'custom');
                            setCurrentTrackIndex(0);
                            if (isMusicPlaying && audioRef.current) {
                              audioRef.current.pause();
                              setTimeout(() => {
                                if (audioRef.current) {
                                  audioRef.current.src = getCurrentTracks()[0];
                                  audioRef.current.play();
                                }
                              }, 100);
                            }
                          }}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm"
                        >
                          <option value="lofi">🎵 Lofi Study Music</option>
                          <option value="rain">🌧️ Rain Ambience</option>
                          <option value="custom">🔗 Custom URL</option>
                        </select>
            </div>

                      {/* Custom Music URL Input */}
                      {musicType === 'custom' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Custom Music URL
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={customMusicUrl}
                              onChange={(e) => setCustomMusicUrl(e.target.value)}
                              placeholder="https://example.com/music.mp3"
                              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-sm"
                            />
                            <button
                              onClick={() => {
                                if (customMusicUrl && isMusicPlaying && audioRef.current) {
                                  audioRef.current.pause();
                                  setTimeout(() => {
                                    if (audioRef.current) {
                                      audioRef.current.src = customMusicUrl;
                                      audioRef.current.play();
                                    }
                                  }, 100);
                                }
                              }}
                              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                            >
                              Load
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Supports direct MP3, WAV, or streaming URLs. For YouTube, use a YouTube to MP3 converter service.
                          </p>
                          <div className="text-xs text-gray-500 mt-2 space-y-1">
                            <div>💡 <strong>Tips:</strong></div>
                            <div>• Use direct audio file links (.mp3, .wav)</div>
                            <div>• For Spotify: Use external converter services</div>
                            <div>• For YouTube: Convert to MP3 first</div>
                            <div>• Test your URL in browser first</div>
                            <div className="mt-2 p-2 bg-yellow-900 bg-opacity-30 rounded">
                              <div>⚠️ <strong>Note:</strong></div>
                              <div>External music URLs may have CORS restrictions.</div>
                              <div>Try using local files or converted URLs.</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Play/Pause Button */}
                      <button
                        onClick={toggleMusic}
                        className="flex items-center space-x-2 w-full text-left hover:bg-slate-700 p-2 rounded transition-colors"
                      >
                        {isMusicPlaying ? (
                          <>
                            <Pause className="w-4 h-4 text-orange-400" />
                            <span className="text-white text-sm">Pause Music</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-orange-400" />
                            <span className="text-white text-sm">Play Music</span>
                          </>
                        )}
                      </button>
                      
                      {/* Next Track Button */}
                      {getCurrentTracks().length > 1 && (
                        <button
                          onClick={nextTrack}
                          className="flex items-center space-x-2 w-full text-left hover:bg-slate-700 p-2 rounded transition-colors"
                        >
                          <SkipForward className="w-4 h-4 text-orange-400" />
                          <span className="text-white text-sm">Next Track</span>
                        </button>
                      )}
                      
                      {/* Volume Control */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {musicVolume > 0 ? (
                              <Volume2 className="w-4 h-4 text-orange-400" />
                            ) : (
                              <VolumeX className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-white text-sm">Volume</span>
                          </div>
                          <span className="text-xs text-gray-400">{Math.round(musicVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={musicVolume}
                          onChange={(e) => changeVolume(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      {/* Track Info */}
                      <div className="text-xs text-gray-400 pt-2 border-t border-slate-700">
                        {musicType === 'custom' ? 'Custom Track' : `Track ${currentTrackIndex + 1} of ${getCurrentTracks().length}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-orange-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Timer Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Circular Timer */}
          <div className="relative w-full max-w-[320px] aspect-square mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
              {/* Background circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="#2e2e35"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke={sessionType === 'focused' ? '#f97316' : '#10b981'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
              />
            </svg>
            
            {/* Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-gray-400 mb-2">
                {isActive ? sessionType : 'paused'}
              </p>
              <p className="text-5xl font-bold text-white mb-2">
                {formatTime(timeLeft)}
              </p>
              <p className="text-xs text-gray-500">
                {formatTotalTime(totalTimeToday)}
              </p>
              
              {/* Music Indicator */}
              {isMusicPlaying && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 text-orange-400 bg-black bg-opacity-50 rounded-full px-2 py-1">
                  <Music className="w-3 h-3" />
                  <span className="text-xs">
                    {musicType === 'custom' ? '🎵' : musicType === 'rain' ? '🌧️' : '🎵'}
                    {musicType !== 'custom' && ` ${currentTrackIndex + 1}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handleReset}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              {isActive ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
            
            <button
              onClick={handleSkip}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Study Insight Card */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-slate-800 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">{subject.name}</h2>
            <span className="text-orange-400 text-sm font-medium">{subject.progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${subject.progress}%` }}
            />
          </div>

          {/* Stats Boxes */}
          <div className="space-y-4 flex-1">
            <div className="bg-[#2a2a2f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Today</p>
              <p className="text-lg font-semibold text-white">
                {studyStats ? 
                  (() => {
                    const hours = Math.floor(studyStats.timeSpentToday / 3600);
                    const minutes = Math.floor((studyStats.timeSpentToday % 3600) / 60);
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    } else {
                      return `${minutes}m`;
                    }
                  })() : 
                  `${Math.floor(totalTimeToday / 60)}m`
                }
              </p>
            </div>
            
            <div className="bg-[#2a2a2f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Total</p>
              <p className="text-lg font-semibold text-white">
                {studyStats ? 
                  (() => {
                    const hours = Math.floor(studyStats.timeSpentTotal / 3600);
                    const minutes = Math.floor((studyStats.timeSpentTotal % 3600) / 60);
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    } else {
                      return `${minutes}m`;
                    }
                  })() : 
                  subject.timeSpent
                }
              </p>
            </div>
            
            <div className="bg-[#2a2a2f] p-4 rounded-lg border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Parts Done</p>
              <p className="text-lg font-semibold text-white">
                {studyStats ? `${studyStats.completedChapters}/${studyStats.totalChapters}` : '0/0'}
              </p>
            </div>
          </div>

          {/* Study Streak Footer */}
          <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center text-sm">
            <span className="text-gray-400">Study Streak</span>
            <span className="text-orange-400 font-medium">
              {studyStats ? `${studyStats.studyStreak} days` : '0 days'}
            </span>
          </div>
        </div>
      </div>
      
            {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          {/* Minimal Header */}
          <div className="absolute top-6 right-6 flex items-center space-x-3">
            {/* Music Toggle */}
            <button
              onClick={toggleMusic}
              className={`p-2 rounded transition-colors ${
                isMusicPlaying 
                  ? 'text-orange-400' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Toggle Music (M)"
            >
              <Music className="w-5 h-5" />
            </button>
            
            {/* Exit Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
              title="Exit Fullscreen (Esc)"
            >
              <Minimize className="w-5 h-5" />
            </button>
          </div>

          {/* Main Timer Display */}
          <div className="text-center">
            {/* Session Status */}
            <div className="mb-12">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                sessionType === 'focused' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isActive ? 'animate-pulse' : ''
                }`}></div>
                <span>{isActive ? sessionType : 'paused'}</span>
              </div>
            </div>
            
            {/* Flip Clock Animation */}
            <div className="mb-16">
              <div className="flipClock">
                <FlipUnitContainer 
                  unit={'minutes'}
                  digit={displayMinutes} 
                  shuffle={minutesFlip} 
                />
                <div className="text-8xl font-bold text-white mx-8">:</div>
                <FlipUnitContainer 
                  unit={'seconds'}
                  digit={displaySeconds} 
                  shuffle={secondsFlip} 
                />
              </div>
            </div>
            
            {/* Minimal Controls */}
            <div className="flex items-center justify-center space-x-12">
              <button
                onClick={handleReset}
                className="p-3 text-gray-500 hover:text-white transition-colors"
                title="Reset (R)"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                title="Play/Pause (Space)"
              >
                {isActive ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ml-1" />
                )}
              </button>
              
              <button
                onClick={handleSkip}
                className="p-3 text-gray-500 hover:text-white transition-colors"
                title="Skip (S)"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1f] rounded-xl p-6 w-full max-w-md mx-4 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Timer Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Focus Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Focus Duration (minutes)
                </label>
                                                    <input
                    type="text"
                    value={inputValues.focusDuration}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValues(prev => ({ ...prev, focusDuration: value }));
                      // Only update timer settings if it's a valid number
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 0) {
                        setTimerSettings(prev => ({ ...prev, focusDuration: numValue }));
                        if (sessionType === 'focused' && !isActive) {
                          setTimeLeft(numValue * 60);
                        }
                      }
                    }}
                    placeholder="Enter minutes (1-180)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
              </div>
              
              {/* Break Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Break Duration (minutes)
                </label>
                                  <input
                    type="text"
                    value={inputValues.breakDuration}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValues(prev => ({ ...prev, breakDuration: value }));
                      // Only update timer settings if it's a valid number
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 0) {
                        setTimerSettings(prev => ({ ...prev, breakDuration: numValue }));
                        if (sessionType === 'break' && !isActive) {
                          setTimeLeft(numValue * 60);
                        }
                      }
                    }}
                    placeholder="Enter minutes (1-30)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
              </div>
              
              {/* Long Break Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Long Break Duration (minutes)
                </label>
                                                    <input
                    type="text"
                    value={inputValues.longBreakDuration}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValues(prev => ({ ...prev, longBreakDuration: value }));
                      // Only update timer settings if it's a valid number
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 0) {
                        setTimerSettings(prev => ({ ...prev, longBreakDuration: numValue }));
                      }
                    }}
                    placeholder="Enter minutes (1-180)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
              </div>
              
              {/* Auto-start next session */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  {timerSettings.autoStartNext ? (
                    <PlayCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <PauseCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <label className="text-sm font-medium text-white">
                      Auto-start next session
                    </label>
                    <p className="text-xs text-gray-400">Automatically start break after focus</p>
                  </div>
                </div>
                <button
                  onClick={() => setTimerSettings(prev => ({ ...prev, autoStartNext: !prev.autoStartNext }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    timerSettings.autoStartNext ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    timerSettings.autoStartNext ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* Sound notifications */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  {timerSettings.soundNotifications ? (
                    <Bell className="w-5 h-5 text-green-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <label className="text-sm font-medium text-white">
                      Sound notifications
                    </label>
                    <p className="text-xs text-gray-400">Play sound when session ends</p>
                  </div>
                </div>
                <button
                  onClick={() => setTimerSettings(prev => ({ ...prev, soundNotifications: !prev.soundNotifications }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    timerSettings.soundNotifications ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    timerSettings.soundNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Music Type Selection */}
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  <CloudRain className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-white">
                      Music Type
                    </label>
                    <p className="text-xs text-gray-400">Choose background music</p>
                  </div>
                </div>
                <select
                  value={musicType}
                  onChange={(e) => setMusicType(e.target.value as 'lofi' | 'rain' | 'custom')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="lofi">Lofi Study</option>
                  <option value="rain">Rain Ambience</option>
                  <option value="custom">Custom URL</option>
                </select>
              </div>

              {/* Custom Music URL Input */}
              {musicType === 'custom' && (
                <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Link className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={customMusicUrl}
                    onChange={(e) => setCustomMusicUrl(e.target.value)}
                    placeholder="Enter custom music URL (e.g., https://example.com/music.mp3)"
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    // Validate settings before saving
                    const validatedSettings = {
                      focusDuration: Math.max(1, Math.min(180, timerSettings.focusDuration || 25)),
                      breakDuration: Math.max(1, Math.min(30, timerSettings.breakDuration || 5)),
                      longBreakDuration: Math.max(1, Math.min(180, timerSettings.longBreakDuration || 20)),
                      autoStartNext: Boolean(timerSettings.autoStartNext),
                      soundNotifications: Boolean(timerSettings.soundNotifications)
                    };

                    // Save settings to database
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError || !user) {
                      throw new Error('User not authenticated');
                    }

                    const { error: upsertError } = await supabase
                      .from('user_timer_settings')
                      .upsert({
                        user_id: user.id,
                        focus_duration: validatedSettings.focusDuration,
                        break_duration: validatedSettings.breakDuration,
                        long_break_duration: validatedSettings.longBreakDuration,
                        auto_start_next: validatedSettings.autoStartNext,
                        sound_notifications: validatedSettings.soundNotifications,
                        long_break_interval: 4, // Fixed at 4 sessions for now
                        music_type: musicType,
                        custom_music_url: musicType === 'custom' ? customMusicUrl : null
                      }, {
                        onConflict: 'user_id'
                      });

                    if (upsertError) {
                      throw new Error(`Failed to save settings: ${upsertError.message}`);
                    }

                    // Also save to localStorage as backup
                    localStorage.setItem('pomodoroSettings', JSON.stringify(validatedSettings));
                    
                    setShowSettings(false);
                    
                    // Show success message
                    toast({
                      title: "Settings Saved",
                      description: "Your timer settings have been saved successfully.",
                    });
                  } catch (error) {
                    console.error('Error saving timer settings:', error);
                    toast({
                      title: "Save Error",
                      description: "Failed to save settings. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for slider and flip clock */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Droid+Sans+Mono');
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
        }
        
        /* Flip Clock Animation */
        .flipClock {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }

        .flipUnitContainer {
          display: block;
          position: relative;
          width: 180px;
          height: 150px;
          perspective-origin: 50% 50%;
          perspective: 400px;
          background-color: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0px 15px 25px -10px rgba(0,0,0,0.8);
          margin: 0 15px;
          border: 1px solid #333;
        }

        .upperCard, .lowerCard {
          display: flex;
          position: relative;
          justify-content: center;
          width: 100%;
          height: 50%;
          overflow: hidden;
          border: 1px solid #333;
        }

        .upperCard span, .lowerCard span {
          font-size: 6em;
          font-family: 'Droid Sans Mono', monospace;
          font-weight: lighter;
          color: #fff;
        }

        .upperCard {
          align-items: flex-end;
          border-bottom: 0.5px solid #333;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .upperCard span {
          transform: translateY(50%);
        }

        .lowerCard {
          align-items: flex-start;
          border-top: 0.5px solid #333;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        .lowerCard span {
          transform: translateY(-50%);
        }

        .flipCard {
          display: flex;
          justify-content: center;
          position: absolute;
          left: 0;
          width: 100%;
          height: 50%;
          overflow: hidden;
          backface-visibility: hidden;
        }

        .flipCard span {
          font-family: 'Droid Sans Mono', monospace;
          font-size: 6em;
          font-weight: lighter;
          color: #fff;
        }

        .flipCard.unfold {
          top: 50%;
          align-items: flex-start;
          transform-origin: 50% 0%;
          transform: rotateX(180deg);
          background-color: #1a1a1a;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: 0.5px solid #333;
          border-top: 0.5px solid #333;
        }

        .flipCard.unfold span {
          transform: translateY(-50%);
        }

        .flipCard.fold {
          top: 0%;
          align-items: flex-end;
          transform-origin: 50% 100%;
          transform: rotateX(0deg);
          background-color: #1a1a1a;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border: 0.5px solid #333;
          border-bottom: 0.5px solid #333;
        }

        .flipCard.fold span {
          transform: translateY(50%);
        }

        .fold {
          animation: fold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
          transform-style: preserve-3d;
        }

        .unfold {
          animation: unfold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
          transform-style: preserve-3d;
        }

        @keyframes fold {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-180deg);
          }
        }

        @keyframes unfold {
          0% {
            transform: rotateX(180deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `}</style>
    </div>
  );
};
