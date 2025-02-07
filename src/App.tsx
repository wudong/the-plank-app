import React, { useState, useEffect } from 'react';
import { usePlankStore } from './store/plank-store';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, Download as DownloadIcon } from '@mui/icons-material';

import { MainPage } from './pages/MainPage';
import { HistoricalPage } from './pages/HistoricalPage';
import { DataManagePage } from './pages/DataManagePage';
import { SettingsDialog } from './components/settings-dialog';
import Sidebar from './components/Sidebar';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userProfile = usePlankStore((state) => state.userProfile);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleSidebarOpen = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleMenuItemClick = (path: string) => {
    handleSidebarClose();
    if (path === 'settings') {
      setIsSettingsOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          background: (theme) => theme.palette.primary.main,
          // Add safe area insets padding
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: '56px', sm: '64px' },
            paddingLeft: { xs: 1, sm: 2 },
            paddingRight: { xs: 1, sm: 2 },
            // Ensure content is below the notch
            marginTop: { xs: 1, sm: 0 },
          }}
        >
          <IconButton
            color="inherit"
            onClick={handleSidebarOpen}
            edge="start"
            sx={{
              // Ensure the menu icon is properly positioned and clickable
              position: 'relative',
              zIndex: 1,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
            Plank Timer
          </Typography>

          {deferredPrompt && (
            <IconButton color="inherit" onClick={handleInstall}>
              <DownloadIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Sidebar
        open={isSidebarOpen}
        onClose={handleSidebarClose}
        onMenuItemClick={handleMenuItemClick}
        userName={userProfile.name}
        userAvatar={userProfile.avatar}
      />

      <Box sx={{ flexGrow: 1, marginTop: '64px' }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/historical" element={<HistoricalPage />} />
          <Route path="/data" element={<DataManagePage />} />
        </Routes>
      </Box>

      <SettingsDialog open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </Box>
  );
};

export const App: React.FC = () => {
  // Set up auth listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      console.debug('supabase auth state changed', session);
      const store = usePlankStore.getState();
      if (session?.user) {
        const { user_metadata } = session.user;
        store.updateUserProfile(user_metadata.full_name, user_metadata.avatar_url);
      }

      store.setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
