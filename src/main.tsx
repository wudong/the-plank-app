import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { theme } from './theme';
import { App } from './App';
import { supabase } from './lib/supabase';
import { usePlankStore } from './store/plank-store';

// Initialize Google One Tap sign-in
const initializeGoogleOneTap = () => {
  window.handleSignInWithGoogle = async (response: any) => {
    console.debug('Handle signin in with Google ID Token', response);

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });

    if (error) {
      console.error('Error sign in with Google ID Token:', error);
      throw error;
    }

    console.info('Signed in with Google ID Token');

    // Fetch user data after successful authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.debug('supabase user', user);

      const { user_metadata } = user;
      await usePlankStore
        .getState()
        .updateUserProfile(user_metadata.full_name, user_metadata.avatar_url);
    } else {
      console.error('cannot retrieve supabase user');
    }
  };

  // Load Google One Tap script programmatically
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  document.body.appendChild(script);
};

// Initialize Google One Tap
initializeGoogleOneTap();

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

// Global styles
const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'html, body': {
    height: '100%',
    overscrollBehavior: 'none',
  },
  body: {
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitTextSizeAdjust: '100%',
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
