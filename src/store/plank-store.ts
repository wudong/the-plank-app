import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  PlankSession, 
  PlankStats, 
  ReminderSettings, 
  TimeAggregation,
  ProgressDataPoint 
} from '../types/plank';

interface PlankState {
  // Data
  sessions: PlankSession[];
  reminderSettings: ReminderSettings;
  
  // Timer state
  isActive: boolean;
  currentTime: number;
  
  // Computed stats
  stats: PlankStats;
  
  // Actions
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  getProgressData: (aggregation: TimeAggregation) => ProgressDataPoint[];
  calculateTargetDuration: () => number;
  requestNotificationPermission: () => Promise<void>;
}

const calculateStats = (sessions: PlankSession[]): PlankStats => {
  if (sessions.length === 0) {
    return {
      longestTime: 0,
      longestStreak: 0,
      currentStreak: 0,
      lastWeekAverage: 0
    };
  }

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate longest time
  const longestTime = Math.max(...sessions.map(s => s.duration));

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakCount = 0;
  let lastDate = new Date();

  sortedSessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const diffDays = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      currentStreakCount++;
      if (currentStreakCount > longestStreak) {
        longestStreak = currentStreakCount;
      }
    } else {
      currentStreakCount = 1;
    }
    lastDate = sessionDate;
  });
  
  currentStreak = currentStreakCount;

  // Calculate last week average
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekSessions = sessions.filter(s => new Date(s.date) >= lastWeek);
  const lastWeekAverage = lastWeekSessions.length > 0
    ? lastWeekSessions.reduce((acc, s) => acc + s.duration, 0) / lastWeekSessions.length
    : 0;

  return {
    longestTime,
    longestStreak,
    currentStreak,
    lastWeekAverage
  };
};

const aggregateData = (
  sessions: PlankSession[], 
  aggregation: TimeAggregation
): ProgressDataPoint[] => {
  if (sessions.length === 0) return [];

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const groupedData: { [key: string]: number[] } = {};
  
  sortedSessions.forEach(session => {
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
    average: durations.reduce((acc, curr) => acc + curr, 0) / durations.length
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
        notificationsPermission: false
      },
      isActive: false,
      currentTime: 0,
      stats: {
        longestTime: 0,
        longestStreak: 0,
        currentStreak: 0,
        lastWeekAverage: 0
      },

      // Actions
      startTimer: () => set({ isActive: true }),
      
      stopTimer: () => set({ isActive: false }),
      
      resetTimer: () => set({ currentTime: 0, isActive: false }),
      
      completeSession: () => {
        const { currentTime, sessions } = get();
        const newSession: PlankSession = {
          id: Date.now().toString(),
          duration: currentTime,
          date: new Date().toISOString(),
          targetDuration: get().calculateTargetDuration(),
          targetReached: currentTime >= get().calculateTargetDuration()
        };
        
        const updatedSessions = [...sessions, newSession];
        set({
          sessions: updatedSessions,
          stats: calculateStats(updatedSessions),
          currentTime: 0,
          isActive: false
        });
      },
      
      updateReminderSettings: (settings) => set((state) => ({
        reminderSettings: { ...state.reminderSettings, ...settings }
      })),

      getProgressData: (aggregation) => aggregateData(get().sessions, aggregation),

      calculateTargetDuration: () => Math.max(
        get().stats.lastWeekAverage,
        30 // minimum target of 30 seconds
      ),

      requestNotificationPermission: async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          set(state => ({
            reminderSettings: {
              ...state.reminderSettings,
              notificationsPermission: permission === 'granted'
            }
          }));
        }
      }
    }),
    {
      name: 'plank-storage'
    }
  )
);
