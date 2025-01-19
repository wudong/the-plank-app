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

import { ratings, ratingOrder } from '../constants/rating-emojis';

const ratingOptions = ratingOrder.map(rating => ({
  value: rating,
  label: `${ratings[rating].emoji} ${ratings[rating].label}`,
  color: ratings[rating].color
}));

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
