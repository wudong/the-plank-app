# New Knowledge Base

## Authentication

- Google One Tap sign-in requires careful script loading order in development. The callback function must be defined before the Google script loads to prevent "callback is not a function" errors.

## Supabase Storage Integration Insights

- When uploading files to Supabase storage, use upsert: true to handle both create and update scenarios
- The .from('bucket-name') method in Supabase storage API helps organize different types of data
- User-specific data in storage should be organized by user ID to maintain data isolation
- The getPublicUrl method can be used to check file existence and get last modified timestamps
- It's important to handle both the local and remote state synchronization when implementing data management features
- Error handling in storage operations should provide clear feedback to users about success/failure

## Supabase Authentication Integration Insights

- Zustand can be extended with auth state by using the persist middleware to maintain login state across refreshes
- @supabase/auth-helpers-react's SessionContextProvider is no longer needed as @supabase/ssr provides better SSR support and simpler client-side auth management x2
- Auth state should be centralized in the store rather than using context for simpler state management
- Using onAuthStateChange listener in App component ensures auth state is always in sync with Supabase
- Prefer async/await with proper error handling in auth methods over promise chains
- Loading states should be managed at the store level to provide consistent UI feedback
- TypeScript types from @supabase/supabase-js can be reused to ensure type safety in auth-related code
- Implementing Google Sign-In with Supabase is straightforward using the signInWithOAuth method
- When using Google Sign-In, it's important to handle the redirect flow properly, especially in a PWA context
- The redirectTo option in signInWithOAuth should be set to the application's origin to ensure proper redirect after authentication
- User metadata from Google Sign-In (like name and avatar) can be accessed via the session.user.user_metadata object
- Updating user profile information should be done both in the local store and in Supabase to keep data in sync
- It's important to handle cases where Google Sign-In metadata might be undefined or null to prevent errors
- The App component is a good place to set up auth state listeners and perform initial user profile updates

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
