import { SessionRating } from '../types/plank';

interface RatingInfo {
  emoji: string;
  label: string;
  color: string;
}

export const ratings: Record<SessionRating, RatingInfo> = {
  'easy': {
    emoji: '😄',
    label: 'Easy Peasy',
    color: '#4CAF50'
  },
  'not-bad': {
    emoji: '🙂',
    label: 'Not Too Bad',
    color: '#8BC34A'
  },
  'ok': {
    emoji: '🙃',
    label: 'It is alright',
    color: '#2196F3'
  },
  'hard': {
    emoji: '😢',
    label: 'Belly is burning',
    color: '#FF9800'
  },
  'superman': {
    emoji: '💀',
    label: 'I\'m dead',
    color: '#F44336'
  }
};

// Order from easiest to hardest
export const ratingOrder: SessionRating[] = ['easy', 'not-bad', 'ok', 'hard', 'superman'];
