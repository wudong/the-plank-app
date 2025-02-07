import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { usePlankStore } from '../store/plank-store';
import { supabase } from '../lib/supabase';
import React from 'react';

export function DataManagePage() {
  const { sessions, stats, reminderSettings, user } = usePlankStore();
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const checkLastSaved = async () => {
      if (!user) return;

      try {
        const { data } = await supabase.storage
          .from('user-data')
          .getPublicUrl(`${user.id}/data.json`);

        if (data?.publicUrl) {
          const response = await fetch(data.publicUrl);
          const metadata = response.headers.get('last-modified');
          if (metadata) {
            setLastSaved(new Date(metadata).toLocaleString());
          }
        }
      } catch (error) {
        console.error('Error checking last saved:', error);
      }
    };

    checkLastSaved();
  }, [user]);

  const saveToRemote = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = {
        sessions,
        stats,
        reminderSettings,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase.storage
        .from('user-data')
        .upload(`${user.id}/data.json`, JSON.stringify(data), {
          upsert: true,
        });

      if (error) throw error;

      setLastSaved(new Date().toLocaleString());
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data to remote storage');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromRemote = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('user-data')
        .download(`${user.id}/data.json`);

      if (error) throw error;

      const text = await data.text();
      const parsedData = JSON.parse(text);

      // Update store with remote data
      usePlankStore.setState({
        sessions: parsedData.sessions,
        stats: parsedData.stats,
        reminderSettings: parsedData.reminderSettings,
      });

      alert('Data loaded successfully from remote storage');
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data from remote storage');
    } finally {
      setIsLoading(false);
    }
  };

  const cleanLocal = () => {
    if (confirm('Are you sure you want to clean local data? This cannot be undone.')) {
      usePlankStore.getState().reset();
    }
  };

  const cleanRemote = async () => {
    if (!user) return;

    if (confirm('Are you sure you want to clean remote data? This cannot be undone.')) {
      setIsLoading(true);
      try {
        const { error } = await supabase.storage.from('user-data').remove([`${user.id}/data.json`]);

        if (error) throw error;

        setLastSaved(null);
        alert('Remote data cleaned successfully');
      } catch (error) {
        console.error('Error cleaning remote data:', error);
        alert('Failed to clean remote data');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Please login to manage your data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Data Management
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="body1">Last saved to remote: {lastSaved || 'Never'}</Typography>

          <Button variant="contained" onClick={saveToRemote} disabled={isLoading}>
            Save to Remote
          </Button>

          <Button variant="outlined" onClick={loadFromRemote} disabled={isLoading}>
            Load from Remote
          </Button>
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>

        <Stack spacing={2}>
          <Button variant="outlined" color="error" onClick={cleanLocal} disabled={isLoading}>
            Clean Local Data
          </Button>

          <Button variant="outlined" color="error" onClick={cleanRemote} disabled={isLoading}>
            Clean Remote Data
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
