# New Knowledge Base

## Supabase Authentication Integration Insights

- Zustand can be extended with auth state by using the persist middleware to maintain login state across refreshes
- Auth state should be centralized in the store rather than using context for simpler state management
- SessionContextProvider from Supabase is useful for auth helpers but not necessary for basic auth flow
- Using onAuthStateChange listener in App component ensures auth state is always in sync with Supabase
- Prefer async/await with proper error handling in auth methods over promise chains
- Loading states should be managed at the store level to provide consistent UI feedback
- TypeScript types from @supabase/supabase-js can be reused to ensure type safety in auth-related code
- Implementing Google Sign-In with Supabase is straightforward using the signInWithOAuth method
- When using Google Sign-In, it's important to handle the redirect flow properly, especially in a PWA context
- The redirectTo option in signInWithOAuth should be set to the application's origin to ensure proper redirect after authentication

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
