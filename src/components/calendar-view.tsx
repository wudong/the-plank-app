import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePlankStore } from '../store/plank-store';
import { SessionRating, PlankSession } from '../types/plank';

interface DayProps {
  date: Date;
  isCurrentMonth: boolean;
  hasSession: boolean;
  rating?: SessionRating;
  today: Date;
  targetReached?: boolean;
  selectedDate: Date | null;
  onClick?: (date: Date) => void;
}

import { ratings, ratingOrder } from '../constants/rating-emojis';

const DayCell: React.FC<DayProps> = ({
  date,
  isCurrentMonth,
  hasSession,
  rating,
  today,
  targetReached,
  selectedDate,
  onClick,
}) => {
  const theme = useTheme();

  const handleClick = () => {
    if (hasSession && onClick) {
      onClick(date);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        height: '60px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        bgcolor: isCurrentMonth
          ? targetReached
            ? alpha(theme.palette.success.main, 0.1)
            : 'background.paper'
          : 'action.disabledBackground',
        opacity: isCurrentMonth ? 1 : 0.5,
        cursor: hasSession ? 'pointer' : 'default',
        border:
          selectedDate &&
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear()
            ? `2px solid ${theme.palette.secondary.main}`
            : date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: hasSession ? theme.palette.primary.main : 'inherit',
        }}
      >
        {date.getDate()}
      </Typography>
      {hasSession && rating && (
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          {ratings[rating].emoji}
        </Typography>
      )}
    </Box>
  );
};

interface CalendarViewProps {
  onSelectDay?: (date: Date | null) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSelectDay }) => {
  const sessions = usePlankStore((state) => state.sessions);
  const theme = useTheme();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());

  React.useEffect(() => {
    // Trigger the callback with today's date on mount
    if (onSelectDay) {
      onSelectDay(new Date());
    }
  }, [onSelectDay]);

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    onSelectDay?.(date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const today = new Date();
  const isNextMonthFuture = useMemo(() => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    return nextMonth > new Date(today.getFullYear(), today.getMonth());
  }, [currentDate]);

  const handleNextMonth = () => {
    if (!isNextMonthFuture) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    }
  };

  const calendar = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // Get the days with sessions for the current month
    const sessionMap = sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getMonth() === currentDate.getMonth() &&
          sessionDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .reduce((acc, session) => {
        const day = new Date(session.date).getDate();
        const existingSession = acc.get(day);

        // Initialize or update session
        if (!existingSession) {
          acc.set(day, session);
        } else {
          // Keep the session with better rating but track if any session reached target
          const useNewSession =
            session.rating &&
            (!existingSession.rating ||
              ratingOrder.indexOf(session.rating) < ratingOrder.indexOf(existingSession.rating));

          acc.set(day, {
            ...(useNewSession ? session : existingSession),
            targetReached: existingSession.targetReached || session.targetReached, // true if any session reached target
          });
        }
        return acc;
      }, new Map<number, PlankSession>());

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = startOfMonth.getDay();

    // Convert to Monday-based week (0 = Monday, 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      hasSession: boolean;
      rating?: SessionRating;
      targetReached?: boolean;
    }> = [];

    // Add days from previous month
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const daysInPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
        isCurrentMonth: false,
        hasSession: false,
        rating: undefined,
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
        hasSession: sessionMap.has(i),
        rating: sessionMap.get(i)?.rating,
        targetReached: sessionMap.get(i)?.targetReached,
      });
    }

    // Add days from next month
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    let nextMonthDay = 1;
    while (days.length < 42) {
      // 6 rows × 7 days = 42
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonthDay++),
        isCurrentMonth: false,
        hasSession: false,
        rating: undefined,
      });
    }

    return days;
  }, [sessions, currentDate]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          onClick={handlePreviousMonth}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Typography variant="h6">&lt;</Typography>
        </Box>
        <Box
          onClick={() => setCurrentDate(new Date())}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Typography variant="h6">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Box
          onClick={handleNextMonth}
          sx={{
            cursor: isNextMonthFuture ? 'not-allowed' : 'pointer',
            opacity: isNextMonthFuture ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Typography variant="h6">&gt;</Typography>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}
        >
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                p: 1,
                textAlign: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary,
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid',
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          {calendar.map((day, index) => (
            <DayCell
              key={index}
              {...day}
              today={today}
              targetReached={day.hasSession ? day.targetReached : undefined}
              onClick={handleSelectDay}
              selectedDate={selectedDate}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
