import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import {
  Timeline as TimelineIcon,
  LocalFireDepartment as StreakIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { usePlankStore } from '../store/plank-store';
import { useTimer } from '../hooks/use-timer';

export const StatsDisplay: React.FC = () => {
  const theme = useTheme();
  const stats = usePlankStore((state) => state.stats);
  const { formatTime } = useTimer();

  const statItems = [
    {
      label: 'Longest Time',
      value: `${formatTime(stats.longestTime)} `,
      icon: TimelineIcon,
      color: theme.palette.primary.main,
    },
    {
      label: 'Longest Streak',
      value: `${stats.longestStreak} d`,
      icon: StarIcon,
      color: theme.palette.warning.main,
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} d`,
      icon: StreakIcon,
      color:
        stats.currentStreak >= stats.longestStreak
          ? theme.palette.success.main
          : theme.palette.info.main,
    },
  ];

  return (
    <Grid container spacing={1} sx={{ justifyContent: 'space-between' }}>
      {statItems.map((stat, index) => (
        <Grid item xs={4} key={index}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: `${stat.color}15`,
              }}
            >
              <stat.icon
                sx={{
                  color: stat.color,
                  fontSize: 28,
                }}
              />
            </Box>
            <CardContent sx={{ textAlign: 'center', p: 1 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: stat.color,
                }}
              >
                {stat.value}
              </Typography>
              <Typography color="text.secondary">{stat.label}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
