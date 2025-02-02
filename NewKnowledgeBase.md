# New Knowledge Base

## Calendar Implementation Insights

- MUI Grid system can be replaced with CSS Grid (display: grid) for more precise control over calendar layouts
- The alpha utility from @mui/material/styles is useful for creating subtle background colors for interactive elements
- Using Set data structure for efficient lookup of session dates in the calendar improves performance
- Converting between Sunday-based (JavaScript) and Monday-based week systems requires careful index manipulation

## React State Management Insights

- Local component state should be synchronized with global state using useEffect to prevent inconsistencies during rerenders
- When a component's state depends on an external state (like timer.isActive), adding an effect to reset local state when the external state changes prevents state desynchronization

## Streak Calculation Insights

- Separating streak calculation into a dedicated module improves testability and reuse across different features
- When calculating day streaks, it's crucial to normalize dates to midnight (setHours(0, 0, 0, 0)) for accurate day comparisons
- Multiple sessions in a single day should be treated as one day for streak counting by using a Map or Set to track unique dates
- Streak calculation should handle three key scenarios:
  - Single session case needs special handling for current streak (is it today?)
  - Current streak needs to check if the last session was today or yesterday
  - Longest streak needs to examine all sequences of consecutive days
- Processing dates in chronological order (oldest to newest) provides more intuitive streak counting logic
