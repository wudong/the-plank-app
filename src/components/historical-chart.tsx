import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { usePlankStore } from '../store/plank-store';
import { useTimer } from '../hooks/use-timer';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

export const HistoricalChart: React.FC = () => {
  const { formatTime } = useTimer();
  const sessions = usePlankStore((state) => state.sessions);

  // Process the last 30 days of data
  const data = React.useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Create a map to store daily sessions
    const dailySessionsMap = new Map<string, number[]>();

    // Initialize last 30 days with empty arrays
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailySessionsMap.set(dateStr, []);
    }

    // Group sessions by date
    sessions
      .filter((session) => new Date(session.date) >= thirtyDaysAgo)
      .forEach((session) => {
        const dateStr = new Date(session.date).toISOString().split('T')[0];
        const sessionsForDay = dailySessionsMap.get(dateStr) || [];
        sessionsForDay.push(session.duration);
        dailySessionsMap.set(dateStr, sessionsForDay);
      });

    // Convert to array and calculate averages
    return Array.from(dailySessionsMap.entries())
      .map(([date, durations]) => ({
        date,
        average:
          durations.length > 0
            ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
            : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date ascending
  }, [sessions]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload || !label) return null;

    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <div>{new Date(label).toLocaleDateString()}</div>
        <div style={{ color: '#82ca9d' }}>Average: {formatTime(payload[0]?.value || 0)}</div>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 400, mb: 2 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              }
            />
            <YAxis
              tickFormatter={(value) => `${Math.round(value)}m`}
              // Calculate nice rounded minutes for ticks
              ticks={[0, 1, 2, 3, 4, 5, 10, 15, 20].filter(
                (tick) => tick <= Math.ceil(Math.max(...data.map((d) => d.average / 60)))
              )}
              domain={[0, 'maxData']}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={(data) => Number((data.average / 60).toFixed(1))}
              stroke="#82ca9d"
              name="Average Time"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
