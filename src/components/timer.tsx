import React, { useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';
import { useTimer } from '../hooks/use-timer';

export const Timer: React.FC = () => {
  const theme = useTheme();
  const {
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
    completeSession
  } = useTimer();

  // Sound effects
  useEffect(() => {
    const playSound = (frequency: number, duration: number) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, duration);
    };

    if (isActive) {
      if (isHalfway) {
        playSound(880, 200); // A5 note
      }
      if (isTargetReached) {
        playSound(1760, 400); // A6 note
      }
      // Every 10 seconds over target
      if (isTargetReached && currentTime % 10 === 0) {
        playSound(1174.66, 200); // D6 note
      }
    }
  }, [isActive, isHalfway, isTargetReached, currentTime]);

  const getProgressColor = () => {
    if (isTargetReached) return theme.palette.success.main;
    if (isHalfway) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          mb: 2
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={300}
          thickness={4}
          sx={{ color: getProgressColor() }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" component="div" color="text.primary">
            {formattedCurrentTime}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Target: {formattedTargetTime}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', mt: 2 }}>
        <IconButton
          onClick={() => {
            if (isActive) {
              // Stop and record current session
              stopTimer();
              completeSession();
            } else if (!isActive && currentTime > 0) {
              // Reset for a new session when restart is clicked
              resetTimer();
              startTimer();
            } else {
              // Start new session
              startTimer();
            }
          }}
          color={isActive ? "error" : (!isActive && currentTime > 0 ? "success" : "primary")}
          size="large"
          sx={{ 
            bgcolor: isActive 
              ? 'error.main' 
              : (!isActive && currentTime > 0 
                  ? 'success.main' 
                  : 'primary.main'), 
            color: 'white', 
            width: 80,
            height: 80,
            '& svg': {
              fontSize: 40
            },
            '&:hover': { 
              bgcolor: isActive 
                ? 'error.dark' 
                : (!isActive && currentTime > 0 
                    ? 'success.dark' 
                    : 'primary.dark')
            }
          }}
        >
          {isActive 
            ? <StopIcon /> 
            : (!isActive && currentTime > 0 
                ? <ResetIcon /> 
                : <PlayIcon />)}
        </IconButton>
      </Box>

      {isTargetReached && (
        <Typography
          variant="h6"
          color="success.main"
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          Target Reached! Keep Going!
        </Typography>
      )}
    </Box>
  );
};
