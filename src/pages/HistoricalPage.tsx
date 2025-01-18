import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ProgressChart } from '../components/progress-chart';

export const HistoricalPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Historical Progress
        </Typography>
        <Box sx={{ mt: 2, height: isMobile ? 300 : 400 }}>
          <ProgressChart />
        </Box>
      </Paper>
    </Container>
  );
};
