import React, { useEffect, useState } from 'react';
import plankImage from '../assets/plank-image.png';
import { Box, IconButton, Typography, CircularProgress, useTheme } from '@mui/material';
import { QuickRating } from './quick-rating';
import { PlayArrow as PlayIcon, Stop as StopIcon, Refresh as ResetIcon } from '@mui/icons-material';
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
    completeSession,
  } = useTimer();
  const [sessionEnded, setSessionEnded] = useState(false);

  // Reset sessionEnded when timer becomes active
  useEffect(() => {
    if (isActive) {
      setSessionEnded(false);
    }
  }, [isActive]);

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
        height: '100%',
        gap: 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          mb: 2,
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

      <Box sx={{ display: 'flex', mt: 2, mb: sessionEnded ? 2 : 0 }}>
        <IconButton
          onClick={() => {
            if (isActive) {
              stopTimer();
              setSessionEnded(true);
            } else if (!isActive && currentTime > 0) {
              // Treat reset as completing session with 'ok' rating
              completeSession('ok');
              setSessionEnded(false);
            } else {
              // Start new session
              startTimer();
            }
          }}
          color={isActive ? 'error' : !isActive && currentTime > 0 ? 'warning' : 'primary'}
          size="large"
          sx={{
            bgcolor: isActive
              ? 'error.main'
              : !isActive && currentTime > 0
              ? 'warning.main'
              : 'primary.main',
            color: 'white',
            width: 80,
            height: 80,
            '& svg': {
              fontSize: 40,
            },
            '&:hover': {
              bgcolor: isActive
                ? 'error.dark'
                : !isActive && currentTime > 0
                ? 'warning.dark'
                : 'primary.dark',
            },
          }}
        >
          {isActive ? <StopIcon /> : !isActive && currentTime > 0 ? <ResetIcon /> : <PlayIcon />}
        </IconButton>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '100px', // Fixed height container
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isActive && (
          <Box
            component="img"
            src={plankImage}
            alt="Plank position reference"
            sx={{
              width: '100%',
              maxWidth: '500px',
              height: '100px',
              objectFit: 'contain',
              mt: 4,
            }}
          />
        )}

        {isTargetReached && (
          <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
            Target Reached! Keep Going!
          </Typography>
        )}

        {sessionEnded && (
          <Box sx={{ height: '100px', display: 'flex', alignItems: 'center', mt: 1 }}>
            <QuickRating
              onRate={(rating) => {
                completeSession(rating);
                setSessionEnded(false);
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
