import React from 'react';
import { Container, Box } from '@mui/material';
import { Timer } from '../components/timer';
import { StatsDisplay } from '../components/stats-display';

export const MainPage: React.FC = () => {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        flexGrow: 1, 
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0
      }}
    >
      <Box sx={{ 
        flex: 1,
        mb: 3,
        display: 'flex',
        width: '100%',
        minHeight: 0
      }}>
        <Timer />
      </Box>
      <StatsDisplay />
    </Container>
  );
};
