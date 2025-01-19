import React from 'react';
import { Stack, IconButton, Typography } from '@mui/material';
import { SessionRating } from '../types/plank';
import { ratings, ratingOrder } from '../constants/rating-emojis';

interface QuickRatingProps {
  onRate: (rating: SessionRating) => void;
}

export const QuickRating: React.FC<QuickRatingProps> = ({ onRate }) => {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, width: '100%' }}>
      {ratingOrder.map((rating) => (
        <Stack
          key={rating}
          alignItems="center"
          spacing={1}
          sx={{ flex: 1, justifyContent: 'flex-start' }}
        >
          <IconButton
            onClick={() => onRate(rating)}
            sx={{
              width: 40,
              height: 40,
              bgcolor: ratings[rating].color,
              color: 'white',
              '&:hover': {
                bgcolor: ratings[rating].color,
                filter: 'brightness(0.9)',
              },
            }}
          >
            {ratings[rating].emoji}
          </IconButton>
          <Typography
            variant="caption"
            align="center"
            sx={{
              fontSize: '0.7rem',
              color: 'text.secondary',
              lineHeight: 1.1,
              height: 24,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {ratings[rating].label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
