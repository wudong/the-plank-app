import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Stack
} from '@mui/material';
import { SessionRating } from '../types/plank';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onRate: (rating: SessionRating) => void;
  targetReached: boolean;
  sessionTime: number;
  targetTime: number;
}

const ratingOptions: { value: SessionRating; label: string; color: string }[] = [
  { value: 'easy', label: '😄 Easy Peasy', color: '#4CAF50' },
  { value: 'not-bad', label: '🙂 Not Too Bad', color: '#8BC34A' },
  { value: 'ok', label: '🙃 It is alright', color: '#2196F3' },
  { value: 'hard', label: '😢 Belly is burning', color: '#FF9800' },
  { value: 'superman', label: '💀 I\'m dead', color: '#F44336' }
];

export const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  onRate,
  targetReached,
  sessionTime,
  targetTime
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Rate Your Session
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            color={targetReached ? 'success.main' : 'primary.main'}
            sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}
          >
            {targetReached ? 'Well done!' : 'Keep it up next time!'}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ textAlign: 'center', mb: 1 }}
          >
            Session Time: {Math.floor(sessionTime)} seconds
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ textAlign: 'center', mb: 2 }}
          >
            Target Time: {Math.floor(targetTime)} seconds
          </Typography>
        </Box>
        <Stack spacing={2}>
          {ratingOptions.map((option) => (
            <Button
              key={option.value}
              variant="contained"
              fullWidth
              onClick={() => onRate(option.value)}
              sx={{
                bgcolor: option.color,
                '&:hover': {
                  bgcolor: option.color,
                  filter: 'brightness(0.9)'
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
