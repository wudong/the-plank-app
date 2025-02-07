import { usePlankStore } from '../store/plank-store';
import { supabase } from './supabase';

// Initialize Google One Tap sign-in
const initializeGoogleOneTap = () => {
  window.handleSignInWithGoogle = async (response: any) => {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    });

    if (error) {
      console.error('Error sign in with Google ID Token:', error);
      throw error;
    }

    // Fetch user data after successful authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
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
