import { useEffect, useCallback } from 'react';
import { usePlankStore } from '../store/plank-store';

export const useTimer = () => {
  const {
    isActive,
    currentTime,
    startTimer,
    stopTimer,
    resetTimer,
    completeSession,
    calculateTargetDuration,
  } = usePlankStore();

  useEffect(() => {
    let start: number;
    let timeoutId: number;

    const updateTimer = () => {
      if (!isActive) return;

      const elapsed = Math.floor((performance.now() - start) / 1000);
      usePlankStore.setState({
        currentTime: elapsed
      });

      // Schedule next update at the start of the next second
      const nextUpdate = 1000 - ((performance.now() - start) % 1000);
      timeoutId = window.setTimeout(updateTimer, nextUpdate);
    };

    if (isActive) {
      // Synchronize with the system clock
      const now = performance.now();
      start = now - (currentTime * 1000);
      updateTimer();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isActive, currentTime]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const targetDuration = calculateTargetDuration();
  const formattedCurrentTime = formatTime(currentTime);
  const formattedTargetTime = formatTime(targetDuration);
  const progress = (currentTime / targetDuration) * 100;
  const isHalfway = currentTime >= targetDuration / 2;
  const isTargetReached = currentTime >= targetDuration;

  const parseTimeInput = (timeString: string): number | null => {
    const parts = timeString.split(':');
    if (parts.length !== 2) return null;
    
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    
    if (isNaN(minutes) || isNaN(seconds) || seconds >= 60 || minutes < 0 || seconds < 0) {
      return null;
    }
    
    return minutes * 60 + seconds;
  };

  return {
    isActive,
    currentTime,
    formattedCurrentTime,
    formattedTargetTime,
    progress,
    isHalfway,
    isTargetReached,
    startTimer,
    stopTimer,
    resetTimer,
    completeSession,
    formatTime,
    targetDuration,
    parseTimeInput,
    setManualTarget: usePlankStore.getState().setManualTarget,
  };
};
