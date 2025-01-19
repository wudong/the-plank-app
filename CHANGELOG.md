# Changelog

## [Unreleased]

### Added

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

- Replaced rating dialog with inline quick rating buttons for faster session rating
- Made session list more compact by reducing spacing and using smaller typography
- Redesigned Historical page layout with calendar view at the top and session details below
- Renamed "Historical Progress" section to "Trend Analysis"
- Improved spacing and padding in Historical page components
- Enhanced calendar view visualization:
  - Show success background color when any session in a day reaches target
  - Current day is now shown with a highlighted border on all sides
  - Fixed right border styling consistency in calendar grid
- Refactored session list in Historical page into a separate reusable component
- Improved QuickRating component with consistent button alignment and fixed-height labels

### Fixed

- Calendar view now correctly shows target reached status when any session in a day reaches the target
- Fixed border styling for current day to highlight all four sides
- Fixed rating dialog appearing during active sessions by properly synchronizing session end state
- Fixed layout jumps in Timer component by standardizing image and rating component heights to 100px
- Fixed streak calculation by properly handling consecutive days and multiple daily sessions, ensuring accurate tracking of current and longest streaks
