import React from 'react';
import { Container, Box } from '@mui/material';
import { Timer } from '../components/timer';
import { StatsDisplay } from '../components/stats-display';
import { useTimer } from '../hooks/use-timer';

export const MainPage: React.FC = () => {
  const { isActive } = useTimer();
  return (
    <Container
      maxWidth="md"
      sx={{
        flexGrow: 1,
        py: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          flex: 1,
          mb: 2,
          display: 'flex',
          width: '100%',
          minHeight: 0,
        }}
      >
        <Timer />
      </Box>
      {!isActive && <StatsDisplay />}
    </Container>
  );
};
