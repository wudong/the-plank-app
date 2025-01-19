interface StreakResult {
  longestStreak: number;
  currentStreak: number;
  longestStreakStart: Date | null;
  longestStreakEnd: Date | null;
  currentStreakStart: Date | null;
  currentStreakEnd: Date | null;
}

export function computeStreak(days: Date[]): StreakResult {
  const result: StreakResult = {
    longestStreak: 0,
    currentStreak: 0,
    longestStreakStart: null,
    longestStreakEnd: null,
    currentStreakStart: null,
    currentStreakEnd: null,
  };

  if (days.length === 0) {
    return result;
  }

  // Sort days from most recent to oldest
  const sortedDays = days.sort((a, b) => b.getTime() - a.getTime());

  // Function to get the date of the previous day
  const getPreviousDay = (date: Date): Date => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    previousDay.setHours(0, 0, 0, 0);
    return previousDay;
  };

  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakStart: Date | null = null;
  let currentStreakEnd: Date | null = null;
  let longestStreakStart: Date | null = null;
  let longestStreakEnd: Date | null = null;

  for (let i = 0; i < sortedDays.length; i++) {
    const today = new Date(sortedDays[i]);
    today.setHours(0, 0, 0, 0);
    let expectedDay = new Date(sortedDays[i]);
    expectedDay.setHours(0, 0, 0, 0);

    for (let j = i; j < sortedDays.length; j++) {
      const currentDay = new Date(sortedDays[j]);
      currentDay.setHours(0, 0, 0, 0);
      if (currentDay.getTime() === expectedDay.getTime()) {
        if (currentStreak === 0) {
          currentStreakStart = new Date(currentDay);
        }
        currentStreak++;
        expectedDay = getPreviousDay(currentDay);
        currentStreakEnd = new Date(currentDay);
      } else {
        break; // Streak is broken
      }
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
      longestStreakStart = currentStreakStart;
      longestStreakEnd = currentStreakEnd;
    }

    currentStreak = 0;
    currentStreakStart = null;
    currentStreakEnd = null;
  }

  // Check if the last streak is the current streak
  let actualCurrentStreak = 0;
  let actualCurrentStreakStart: Date | null = null;
  let actualCurrentStreakEnd: Date | null = null;
  let expectedDay = new Date(sortedDays[0]);
  expectedDay.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDays.length; i++) {
    const currentDay = new Date(sortedDays[i]);
    currentDay.setHours(0, 0, 0, 0);
    if (currentDay.getTime() === expectedDay.getTime()) {
      if (actualCurrentStreak === 0) {
        actualCurrentStreakStart = new Date(currentDay);
      }
      actualCurrentStreak++;
      expectedDay = getPreviousDay(currentDay);
      actualCurrentStreakEnd = new Date(currentDay);
    } else {
      break;
    }
  }

  result.longestStreak = longestStreak;
  result.longestStreakStart = longestStreakStart;
  result.longestStreakEnd = longestStreakEnd;
  result.currentStreak = actualCurrentStreak;
  result.currentStreakStart = actualCurrentStreakStart;
  result.currentStreakEnd = actualCurrentStreakEnd;

  return result;
}
