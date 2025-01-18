import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useNotifications } from '../hooks/use-notifications';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const {
    isSupported,
    isEnabled,
    notificationsPermission,
    reminderTime,
    setupNotifications,
    updateSettings
  } = useNotifications();

  const handleNotificationToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnabled = event.target.checked;
    if (newEnabled && !notificationsPermission) {
      const granted = await setupNotifications();
      if (!granted) {
        return; // Don't enable if permission was denied
      }
    }
    updateSettings({ enabled: newEnabled });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ time: event.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reminder Settings</DialogTitle>
      <DialogContent>
        {!isSupported ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Your browser doesn't support notifications.
          </Alert>
        ) : (
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={handleNotificationToggle}
                  color="primary"
                />
              }
              label="Daily Reminders"
            />

            {isEnabled && (
              <>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Reminder Time
                  </Typography>
                  <TextField
                    type="time"
                    value={reminderTime}
                    onChange={handleTimeChange}
                    fullWidth
                    size="small"
                  />
                </Box>

                {!notificationsPermission && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Please allow notifications in your browser to receive reminders.
                  </Alert>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
