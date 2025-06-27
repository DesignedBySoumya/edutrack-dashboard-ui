
import { useState, useEffect, useRef } from 'react';

interface FocusMetrics {
  tabSwitches: number;
  totalFocusTime: number;
  distractionEvents: number;
  lastActiveTime: number;
}

export const useFocusTracking = () => {
  const [metrics, setMetrics] = useState<FocusMetrics>({
    tabSwitches: 0,
    totalFocusTime: 0,
    distractionEvents: 0,
    lastActiveTime: Date.now()
  });
  
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const focusStartTime = useRef(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (!isVisible) {
        // Tab became hidden - user switched away
        setMetrics(prev => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1,
          distractionEvents: prev.distractionEvents + 1
        }));
      } else {
        // Tab became visible - user returned
        focusStartTime.current = Date.now();
        setMetrics(prev => ({
          ...prev,
          lastActiveTime: Date.now()
        }));
      }
    };

    const handleFocus = () => {
      focusStartTime.current = Date.now();
    };

    const handleBlur = () => {
      const focusTime = Date.now() - focusStartTime.current;
      setMetrics(prev => ({
        ...prev,
        totalFocusTime: prev.totalFocusTime + focusTime
      }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const getFocusScore = () => {
    const baseScore = 100;
    const tabSwitchPenalty = metrics.tabSwitches * 5;
    const distractionPenalty = metrics.distractionEvents * 3;
    
    return Math.max(0, baseScore - tabSwitchPenalty - distractionPenalty);
  };

  const resetMetrics = () => {
    setMetrics({
      tabSwitches: 0,
      totalFocusTime: 0,
      distractionEvents: 0,
      lastActiveTime: Date.now()
    });
    focusStartTime.current = Date.now();
  };

  return {
    metrics,
    isTabVisible,
    focusScore: getFocusScore(),
    resetMetrics
  };
};
