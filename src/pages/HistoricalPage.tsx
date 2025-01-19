import { Container, Paper, Stack } from '@mui/material';
import React from 'react';
import { CalendarView } from '../components/calendar-view';
import { usePlankStore } from '../store/plank-store';
import { SessionList } from '../components/session-list';

export const HistoricalPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const sessions = usePlankStore((state) => state.sessions);

  const selectedDaySessions = React.useMemo(() => {
    if (!selectedDate) return [];
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.getDate() === selectedDate.getDate() &&
        sessionDate.getMonth() === selectedDate.getMonth() &&
        sessionDate.getFullYear() === selectedDate.getFullYear()
      );
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedDate, sessions]);

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <CalendarView onSelectDay={setSelectedDate} />
        </Paper>
        {selectedDate && (
          <Paper elevation={1} sx={{ p: 2 }}>
            <SessionList sessions={selectedDaySessions} date={selectedDate} />
          </Paper>
        )}
      </Stack>
    </Container>
  );
};
