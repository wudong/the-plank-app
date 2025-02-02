import { List, ListItem, ListItemText, Stack, Typography, Divider, useTheme } from '@mui/material';
import React from 'react';
import { PlankSession } from '../types/plank';
import { ratings } from '../constants/rating-emojis';

type ViewMode = 'day' | 'week' | 'month';

interface SessionListProps {
  sessions: PlankSession[];
  date: Date;
  viewMode: ViewMode;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getHeaderText = (viewMode: ViewMode, date: Date) => {
  switch (viewMode) {
    case 'day':
      return `${date.toLocaleDateString()}`;
    case 'week': {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }
    case 'month':
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
};

export const SessionList: React.FC<SessionListProps> = ({ sessions, date, viewMode }) => {
  const theme = useTheme();

  return (
    <Stack sx={{ height: '100%', overflow: 'hidden', minHeight: 0 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {getHeaderText(viewMode, date)}
      </Typography>
      {sessions.length > 0 ? (
        <List dense sx={{ py: 0, overflow: 'auto', minHeight: 0 }}>
          {sessions.map((session, index) => (
            <React.Fragment key={session.id}>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  sx={{ my: 0 }}
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        {new Date(session.date).toLocaleDateString()}{' '}
                        {new Date(session.date).toLocaleTimeString()} -{' '}
                        {formatDuration(session.duration)}
                      </Typography>
                      {session.rating && (
                        <Typography variant="body2">{ratings[session.rating].emoji}</Typography>
                      )}
                      {session.targetReached && <Typography variant="body2">🎯</Typography>}
                    </Stack>
                  }
                />
              </ListItem>
              {index < sessions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1, textAlign: 'center' }}>
          No Sessions for This {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
        </Typography>
      )}
    </Stack>
  );
};
