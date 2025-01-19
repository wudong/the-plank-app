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

interface UserProfile {
  name: string;
  age?: string;
  gender?: string;
  avatar?: string;
}

interface PlankState {
  // Data
  sessions: PlankSession[];
  reminderSettings: ReminderSettings;
  userProfile: UserProfile;

  // Timer state
  isActive: boolean;
  currentTime: number;
  timerStartTime: number | null;

  // Computed stats
  stats: PlankStats;

  // Actions
  reset: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  completeSession: (rating?: SessionRating) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  getProgressData: (aggregation: TimeAggregation) => ProgressDataPoint[];
  calculateTargetDuration: () => number;
  requestNotificationPermission: () => Promise<void>;
}

interface StreakInfo {
  length: number;
  startDate: string;
  endDate: string;
}

interface StreakStats {
  longestStreak: StreakInfo;
  currentStreak: StreakInfo;
}

const calculateStreaks = (dates: string[]): StreakStats => {
  if (dates.length === 0) {
    return {
      longestStreak: { length: 0, startDate: '', endDate: '' },
      currentStreak: { length: 0, startDate: '', endDate: '' },
    };
  }

  // Sort dates in descending order (newest to oldest)
  const sortedDates = [...dates].sort().reverse();

  // Handle single date case
  if (dates.length === 1) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(dates[0]);
    const daysSinceSession = Math.round(
      (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isActiveStreak = daysSinceSession <= 1; // Today or yesterday

    return {
      longestStreak: { length: 1, startDate: dates[0], endDate: dates[0] },
      currentStreak: isActiveStreak
        ? { length: 1, startDate: dates[0], endDate: dates[0] }
        : { length: 0, startDate: '', endDate: '' },
    };
  }

  let currentStreak: StreakInfo = { length: 0, startDate: '', endDate: '' };
  let longestStreak: StreakInfo = { length: 0, startDate: '', endDate: '' };
  let tempStreak: StreakInfo = { length: 1, startDate: sortedDates[0], endDate: sortedDates[0] };

  // Check if the most recent session was within the last day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mostRecentDate = new Date(sortedDates[0]);
  const daysSinceLastSession = Math.round(
    (today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isCurrentlyStreaking = daysSinceLastSession <= 1;

  // Calculate streaks by going backwards through dates
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = new Date(sortedDates[i]);
    const nextDate = new Date(sortedDates[i + 1]);
    currentDate.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive days
      tempStreak.length++;
      tempStreak.startDate = sortedDates[i + 1];
    } else {
      // Streak broken
      if (tempStreak.length > longestStreak.length) {
        longestStreak = { ...tempStreak };
      }
      tempStreak = { length: 1, startDate: sortedDates[i + 1], endDate: sortedDates[i + 1] };
    }
  }

  // Check if the final tempStreak is the longest
  if (tempStreak.length > longestStreak.length) {
    longestStreak = { ...tempStreak };
  }

  // Set current streak if it's active
  if (isCurrentlyStreaking) {
    currentStreak = {
      length: tempStreak.length,
      startDate: tempStreak.startDate,
      endDate: sortedDates[0],
    };
  }

  return { longestStreak, currentStreak };
};

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
  const streakStats = calculateStreaks(uniqueDates);

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
    longestStreak: streakStats.longestStreak.length,
    currentStreak: streakStats.currentStreak.length,
    lastWeekAverage,
    streakStartDate: streakStats.currentStreak.startDate,
    streakEndDate: streakStats.currentStreak.endDate,
    longestStreakStartDate: streakStats.longestStreak.startDate,
    longestStreakEndDate: streakStats.longestStreak.endDate,
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
      // Initial state
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

      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      getProgressData: (aggregation) => aggregateData(get().sessions, aggregation),

      calculateTargetDuration: () =>
        Math.max(
          get().stats.lastWeekAverage,
          60 // minimum target of 60 seconds
        ),

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

      reset: () =>
        set({
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
        }),
    }),
    {
      name: 'plank-storage',
    }
  )
);
