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
    calculateTargetDuration
  } = usePlankStore();

  // Update timer every second when active
  useEffect(() => {
    let intervalId: number;

    if (isActive) {
      intervalId = window.setInterval(() => {
        usePlankStore.setState(state => ({
          currentTime: state.currentTime + 1
        }));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

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
    targetDuration
  };
};
