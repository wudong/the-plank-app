import { Container, Paper, Stack, Typography, Tabs, Tab, Box } from '@mui/material';
import React from 'react';
import { HistoricalChart } from '../components/historical-chart';
import { CalendarView } from '../components/calendar-view';
import { SessionList } from '../components/session-list';
import { usePlankStore } from '../store/plank-store';

type ViewMode = 'calendar' | 'chart';

export const HistoricalPage: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const sessions = usePlankStore((state) => state.sessions);

  const handleViewChange = (_: React.SyntheticEvent, newValue: ViewMode) => {
    setViewMode(newValue);
    setSelectedDate(null);
  };

  const handleSelectDay = (date: Date | null) => {
    setSelectedDate(date);
  };

  const filteredSessions = React.useMemo(() => {
    if (!selectedDate) return [];
    return sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getDate() === selectedDate.getDate() &&
          sessionDate.getMonth() === selectedDate.getMonth() &&
          sessionDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, selectedDate]);

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Tabs
              value={viewMode}
              onChange={handleViewChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="history view mode"
            >
              <Tab value="calendar" label="Calendar" />
              <Tab value="chart" label="Trend" />
            </Tabs>
            {viewMode === 'calendar' ? (
              <Stack spacing={2}>
                <CalendarView onSelectDay={handleSelectDay} />
                {selectedDate && (
                  <Box>
                    <SessionList sessions={filteredSessions} date={selectedDate} viewMode="day" />
                  </Box>
                )}
              </Stack>
            ) : (
              <>
                <HistoricalChart />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average session duration over the last 30 days
                </Typography>
              </>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
