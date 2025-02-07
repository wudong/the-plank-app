import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PlankSession,
  PlankStats,
  ReminderSettings,
  TimeAggregation,
  ProgressDataPoint,
  SessionRating,
} from '../types/plank';
import { AuthState } from '../types/auth';
import { supabase } from '../lib/supabase';
import { computeStreak } from '../models/compute-streak';

interface UserProfile {
  name: string;
  age?: string;
  gender?: string;
  avatar?: string;
}

interface PlankState extends AuthState {
  // Data
  sessions: PlankSession[];
  reminderSettings: ReminderSettings;
  userProfile: UserProfile;

  // Timer state
  isActive: boolean;
  currentTime: number;
  timerStartTime: number | null;
  manualTarget: number | null;

  // Computed stats
  stats: PlankStats;

  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  setUser: (user: AuthState['user']) => void;

  // App actions
  reset: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  completeSession: (rating?: SessionRating) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  updateUserProfile: (name: string, avatar: string) => Promise<void>;
  getProgressData: (aggregation: TimeAggregation) => ProgressDataPoint[];
  calculateTargetDuration: () => number;
  requestNotificationPermission: () => Promise<void>;
  setManualTarget: (target: number | null) => void;
}

const calculateStats = (sessions: PlankSession[]): PlankStats => {
  if (sessions.length === 0) {
    return {
      longestTime: 0,
      longestStreak: 0,
      currentStreak: 0,
      lastWeekAverage: 0,
      streakStartDate: '',
      streakEndDate: '',
      longestStreakStartDate: '',
      longestStreakEndDate: '',
    };
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate longest time
  const longestTime = Math.max(...sessions.map((s) => s.duration));

  // Group sessions by date to handle multiple sessions per day
  const dateMap = new Map<string, boolean>();
  sortedSessions.forEach((session) => {
    const date = new Date(session.date);
    date.setHours(0, 0, 0, 0);
    dateMap.set(date.toISOString().split('T')[0], true);
  });

  // Get unique dates
  const uniqueDates = Array.from(dateMap.keys());

  // Calculate streaks
  const uniqueDateObjects = uniqueDates.map((date) => new Date(date));
  const streakResult = computeStreak(uniqueDateObjects);

  // Calculate last week average
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekSessions = sessions.filter((s) => new Date(s.date) >= lastWeek);
  const lastWeekAverage =
    lastWeekSessions.length > 0
      ? lastWeekSessions.reduce((acc, s) => acc + s.duration, 0) / lastWeekSessions.length
      : 0;

  return {
    longestTime,
    longestStreak: streakResult.longestStreak,
    currentStreak: streakResult.currentStreak,
    lastWeekAverage,
    streakStartDate: streakResult.currentStreakStart?.toISOString().split('T')[0] || '',
    streakEndDate: streakResult.currentStreakEnd?.toISOString().split('T')[0] || '',
    longestStreakStartDate: streakResult.longestStreakStart?.toISOString().split('T')[0] || '',
    longestStreakEndDate: streakResult.longestStreakEnd?.toISOString().split('T')[0] || '',
  };
};

const aggregateData = (
  sessions: PlankSession[],
  aggregation: TimeAggregation
): ProgressDataPoint[] => {
  if (sessions.length === 0) return [];

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const groupedData: { [key: string]: number[] } = {};

  sortedSessions.forEach((session) => {
    const date = new Date(session.date);
    let key: string;

    switch (aggregation) {
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      case 'week':
        const weekNumber = Math.floor(date.getDate() / 7);
        key = `${date.getFullYear()}-${date.getMonth() + 1}-W${weekNumber}`;
        break;
      default: // day
        key = date.toISOString().split('T')[0];
    }

    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(session.duration);
  });

  return Object.entries(groupedData).map(([date, durations]) => ({
    date,
    duration: Math.max(...durations),
    average: durations.reduce((acc, curr) => acc + curr, 0) / durations.length,
  }));
};

export const usePlankStore = create<PlankState>()(
  persist(
    (set, get) => ({
      // Initial state with auth properties
      user: null,
      loading: false,
      sessions: [],
      reminderSettings: {
        enabled: true,
        time: '09:00',
        notificationsPermission: false,
      },
      userProfile: {
        name: 'User',
      },
      isActive: false,
      currentTime: 0,
      timerStartTime: null,
      manualTarget: null,
      stats: {
        longestTime: 0,
        longestStreak: 0,
        currentStreak: 0,
        lastWeekAverage: 0,
        streakStartDate: '',
        streakEndDate: '',
        longestStreakStartDate: '',
        longestStreakEndDate: '',
      },

      // Actions
      startTimer: () =>
        set({
          isActive: true,
          timerStartTime: Date.now() - get().currentTime * 1000, // Preserve current time when resuming
        }),

      stopTimer: () => {
        const state = get();
        // Update currentTime based on actual elapsed time
        if (state.timerStartTime) {
          const elapsed = Math.floor((Date.now() - state.timerStartTime) / 1000);
          set({
            isActive: false,
            currentTime: elapsed,
            timerStartTime: null,
          });
        } else {
          set({ isActive: false });
        }
      },

      resetTimer: () =>
        set({
          currentTime: 0,
          isActive: false,
          timerStartTime: null,
        }),

      completeSession: (rating?: SessionRating) => {
        const { currentTime, sessions } = get();
        const newSession: PlankSession = {
          id: Date.now().toString(),
          duration: currentTime,
          date: new Date().toISOString(),
          targetDuration: get().calculateTargetDuration(),
          targetReached: currentTime >= get().calculateTargetDuration(),
          rating,
        };

        const updatedSessions = [...sessions, newSession];
        set({
          sessions: updatedSessions,
          stats: calculateStats(updatedSessions),
          currentTime: 0,
          isActive: false,
        });
      },

      updateReminderSettings: (settings) =>
        set((state) => ({
          reminderSettings: { ...state.reminderSettings, ...settings },
        })),

      updateUserProfile: async (name: string, avatar: string) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            name: name || state.userProfile.name,
            avatar: avatar || state.userProfile.avatar,
          },
        }));

        // Update Supabase user metadata
        await supabase.auth.updateUser({
          data: { name, avatar },
        });
      },

      getProgressData: (aggregation) => aggregateData(get().sessions, aggregation),

      calculateTargetDuration: () => {
        const state = get();
        if (state.manualTarget !== null) {
          return state.manualTarget;
        }
        return Math.max(
          state.stats.lastWeekAverage,
          60 // minimum target of 60 seconds
        );
      },

      setManualTarget: (target: number | null) => set({ manualTarget: target }),

      requestNotificationPermission: async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          set((state) => ({
            reminderSettings: {
              ...state.reminderSettings,
              notificationsPermission: permission === 'granted',
            },
          }));
        }
      },

      // Auth state management
      setUser: (user) => set({ user }),

      // Auth methods
      signInWithGoogle: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
          });

          if (error) {
            console.error('Error signing in with Google:', error);
            throw error;
          }

          // Fetch user data after successful authentication
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { user_metadata } = user;
            await get().updateUserProfile(user_metadata.full_name, user_metadata.avatar_url);
          }
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user });
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user });
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null });
        } finally {
          set({ loading: false });
        }
      },

      // Reset app state
      reset: () =>
        set({
          user: null,
          loading: false,
          sessions: [],
          reminderSettings: {
            enabled: true,
            time: '09:00',
            notificationsPermission: false,
          },
          userProfile: {
            name: 'User',
          },
          isActive: false,
          currentTime: 0,
          timerStartTime: null,
          stats: {
            longestTime: 0,
            longestStreak: 0,
            currentStreak: 0,
            lastWeekAverage: 0,
            streakStartDate: '',
            streakEndDate: '',
            longestStreakStartDate: '',
            longestStreakEndDate: '',
          },
          manualTarget: null,
        }),
    }),
    {
      name: 'plank-storage',
    }
  )
);
