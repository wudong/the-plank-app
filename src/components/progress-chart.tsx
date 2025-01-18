import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePlankStore } from '../store/plank-store';
import { TimeAggregation } from '../types/plank';
import { useTimer } from '../hooks/use-timer';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

export const ProgressChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeAggregation>('week');
  const { formatTime } = useTimer();
  const getProgressData = usePlankStore(state => state.getProgressData);

  const data = getProgressData(timeRange);

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (!active || !payload || !label) return null;

    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1
        }}
      >
        <div>{label}</div>
        {payload.map((item, index) => (
          <div key={index} style={{ color: index === 0 ? '#8884d8' : '#82ca9d' }}>
            {item.dataKey === 'duration' ? 'Best: ' : 'Average: '}
            {formatTime(item.value)}
          </div>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={(_, value) => value && setTimeRange(value)}
          size="small"
        >
          <ToggleButton value="day">Daily</ToggleButton>
          <ToggleButton value="week">Weekly</ToggleButton>
          <ToggleButton value="month">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => formatTime(value)}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="#8884d8"
            name="Best Time"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#82ca9d"
            name="Average"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
