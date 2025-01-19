import { List, ListItem, ListItemText, Stack, Typography, Divider, useTheme } from '@mui/material';
import React from 'react';
import { PlankSession } from '../types/plank';
import { ratings } from '../constants/rating-emojis';

interface SessionListProps {
  sessions: PlankSession[];
  date: Date;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const SessionList: React.FC<SessionListProps> = ({ sessions, date }) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Sessions for {date.toLocaleDateString()}
      </Typography>
      {sessions.length > 0 ? (
        <List dense sx={{ py: 0 }}>
          {sessions.map((session, index) => (
            <React.Fragment key={session.id}>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  sx={{ my: 0 }}
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
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
          No Session So Far
        </Typography>
      )}
    </>
  );
};
