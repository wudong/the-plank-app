import { describe, it, expect } from 'vitest';
import { computeStreak } from '../compute-streak';

describe('computeStreak', () => {
  it('should return 0 for all streaks when the input array is empty', () => {
    const result = computeStreak([]);
    expect(result.longestStreak).toBe(0);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreakStart).toBeNull();
    expect(result.longestStreakEnd).toBeNull();
    expect(result.currentStreakStart).toBeNull();
    expect(result.currentStreakEnd).toBeNull();
  });

  it('should calculate the correct longest and current streaks', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const days = [today, yesterday, twoDaysAgo, threeDaysAgo, fiveDaysAgo, sixDaysAgo];
    const result = computeStreak(days);

    expect(result.longestStreak).toBe(4);
    expect(result.longestStreakStart).toEqual(today);
    expect(result.longestStreakEnd).toEqual(threeDaysAgo);
    expect(result.currentStreak).toBe(4);
    expect(result.currentStreakStart).toEqual(today);
    expect(result.currentStreakEnd).toEqual(threeDaysAgo);
  });

  it('should handle a broken streak and calculate the correct longest and current streaks', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const days = [yesterday, fourDaysAgo, fiveDaysAgo];
    const result = computeStreak(days);

    expect(result.longestStreak).toBe(2);
    expect(result.longestStreakStart).toEqual(fourDaysAgo);
    expect(result.longestStreakEnd).toEqual(fiveDaysAgo);
    expect(result.currentStreak).toBe(1);
    expect(result.currentStreakStart).toEqual(yesterday);
    expect(result.currentStreakEnd).toEqual(yesterday);
  });

  it('should consider only the most recent streak as the current streak', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const days = [yesterday, fourDaysAgo, fiveDaysAgo, sixDaysAgo];
    const result = computeStreak(days);

    expect(result.longestStreak).toBe(3);
    expect(result.longestStreakStart).toEqual(fourDaysAgo);
    expect(result.longestStreakEnd).toEqual(sixDaysAgo);
    expect(result.currentStreak).toBe(1);
    expect(result.currentStreakStart).toEqual(yesterday);
    expect(result.currentStreakEnd).toEqual(yesterday);
  });

  it('should handle out of order dates and calculate streaks correctly', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const days = [twoDaysAgo, today, yesterday];
    const result = computeStreak(days);

    expect(result.longestStreak).toBe(3);
    expect(result.longestStreakStart).toEqual(today);
    expect(result.longestStreakEnd).toEqual(twoDaysAgo);
    expect(result.currentStreak).toBe(3);
    expect(result.currentStreakStart).toEqual(today);
    expect(result.currentStreakEnd).toEqual(twoDaysAgo);
  });
});
