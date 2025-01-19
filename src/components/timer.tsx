import React, { useEffect, useState } from 'react';
import plankImage from '../assets/plank-image.png';
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { QuickRating } from './quick-rating';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as ResetIcon,
  Flag as FlagIcon,
  Edit as EditIcon,
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
    completeSession,
    parseTimeInput,
    setManualTarget,
  } = useTimer();
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isSettingTarget, setIsSettingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(formattedTargetTime);
  const [targetError, setTargetError] = useState('');

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

  const handleTargetSubmit = () => {
    const seconds = parseTimeInput(targetInput);
    if (seconds === null) {
      setTargetError('Please enter a valid time (mm:ss)');
      return;
    }
    if (seconds < 10) {
      setTargetError('Target must be at least 10 seconds');
      return;
    }
    setManualTarget(seconds);
    setIsSettingTarget(false);
    setTargetError('');
  };

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
          <Typography variant="h2" component="div" color="text.primary" sx={{ fontSize: '5rem' }}>
            {formattedCurrentTime}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: !isActive ? 'pointer' : 'default',
              '&:hover': !isActive
                ? {
                    '& .MuiTypography-root': {
                      textDecoration: 'underline',
                    },
                  }
                : {},
            }}
            onClick={() => {
              if (!isActive) {
                setTargetInput(formattedTargetTime);
                setIsSettingTarget(true);
              }
            }}
          >
            {/* <FlagIcon sx={{ color: 'text.secondary', fontSize: '2rem' }} /> */}
            <Typography variant="body2" sx={{ fontSize: '1.5rem' }}>
              🎯
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.5rem', ml: 0.5 }}>
              {formattedTargetTime}
            </Typography>
            {!isActive && <EditIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />}
          </Box>
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

      <Dialog open={isSettingTarget} onClose={() => setIsSettingTarget(false)}>
        <DialogTitle>Set Target Time</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Target Time (mm:ss)"
            fullWidth
            variant="outlined"
            value={targetInput}
            onChange={(e) => {
              setTargetInput(e.target.value);
              setTargetError('');
            }}
            error={!!targetError}
            helperText={targetError}
            placeholder="1:30"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setManualTarget(null);
              setIsSettingTarget(false);
              setTargetError('');
            }}
          >
            Reset to Auto
          </Button>
          <Button onClick={() => setIsSettingTarget(false)}>Cancel</Button>
          <Button onClick={handleTargetSubmit}>Set Target</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
