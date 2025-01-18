/**
 * Represents a single plank exercise session
 */
export type SessionRating = 'easy' | 'not-bad' | 'ok' | 'hard' | 'superman';

export interface PlankSession {
  id: string;
  duration: number; // in seconds
  date: string; // ISO string
  targetReached: boolean;
  targetDuration: number; // in seconds
  rating?: SessionRating;
}

/**
 * Statistics for plank performance
 */
export interface PlankStats {
  longestTime: number; // in seconds
  longestStreak: number; // in days
  currentStreak: number; // in days
  lastWeekAverage: number; // in seconds
}

/**
 * Reminder settings
 */
export interface ReminderSettings {
  enabled: boolean;
  time: string; // 24-hour format HH:mm
  notificationsPermission: boolean;
}

/**
 * View options for history chart
 */
export type TimeAggregation = 'day' | 'week' | 'month';

/**
 * Progress data point for the chart
 */
export interface ProgressDataPoint {
  date: string;
  duration: number;
  average: number;
}
