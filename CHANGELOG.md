# Changelog

## [Unreleased]

### Added

- Added Supabase authentication integration for user accounts
- Added sign in/sign up dialog with email/password authentication
- Added Google Sign-In functionality
- Added auth state management in plank store
- Added auth-related UI elements in sidebar (sign in/sign out buttons)
- Added loading states for auth operations
- Implemented automatic user profile update on Google Sign-In
- Updated App component to handle auth state changes and update user profile

### Changed

- Modified updateUserProfile method in plank store to accept name and avatar separately
- Updated Sidebar component to use the new updateUserProfile method signature

- Added 30-day session duration line chart with daily averages in Historical page
- Added day/week/month filtering tabs in Historical page for better session analysis
- Added manual target time setting by clicking on target display in Timer component
- Calendar view in Historical page showing plank sessions with dots
- Grid-based calendar layout with visual indicators for days with sessions
- Month and year display at the top of calendar
- Daily session list view showing detailed information for each session
- Selected day highlighting with secondary color in calendar
- Month navigation with previous/next round buttons using '<' and '>' symbols
- Click month label functionality to quickly return to current month
- Added Prettier configuration with standardized code formatting rules
- Added QuickRating component for inline session rating
- Added plank position reference image that appears when timer starts

### Changed

- Improved target time input with mobile-friendly spinners and separate minute/second controls
- Added touch-friendly increment/decrement buttons for time adjustment
- Enhanced time input validation with clear visual feedback
- Improved numeric input styling with larger touch targets

- Redesigned Historical page with tabs to switch between calendar view and 30-day trend chart
- Simplified session view by removing detailed session list
- Enhanced timer display with larger text sizes and improved target time UI with flag and edit icons
- Refactored streak calculation into a separate compute-streak module for improved maintainability and reusability
- Replaced rating dialog with inline quick rating buttons for faster session rating
- Made session list more compact by reducing spacing and using smaller typography
- Redesigned Historical page layout with calendar view at the top and session details below
- Removed redundant session date header for cleaner Historical page UI
- Renamed "Historical Progress" section to "Trend Analysis"
- Improved spacing and padding in Historical page components
- Enhanced calendar view visualization:
  - Show success background color when any session in a day reaches target
  - Current day is now shown with a highlighted border on all sides
  - Fixed right border styling consistency in calendar grid
- Refactored session list in Historical page into a separate reusable component
- Improved QuickRating component with consistent button alignment and fixed-height labels
- Made session list scrollable within its container instead of scrolling the entire page

### Fixed

- Fixed current day highlighting in calendar to properly update when the date changes
- Fixed service worker registration by using built-in Vite PWA plugin functionality
- Calendar view now correctly shows target reached status when any session in a day reaches the target
- Fixed border styling for current day to highlight all four sides
- Fixed rating dialog appearing during active sessions by properly synchronizing session end state
- Fixed layout jumps in Timer component by standardizing image and rating component heights to 100px
- Fixed streak calculation by properly handling consecutive days and multiple daily sessions, ensuring accurate tracking of current and longest streaks
- Fixed iOS PWA header issues by properly handling safe area insets and ensuring menu icon is clickable in standalone mode
