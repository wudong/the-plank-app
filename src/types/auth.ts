import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  name?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

export interface Session {
  id: string;
  userId: string;
  synced: boolean;
  // ... other existing session fields will be included in the plank type
}
