# Plank Training App

This project is a plank logging application built with React, TypeScript, and Vite. It allows users to time their plank sessions, track their progress, and visualize historical data through different views and charts. This README provides an overview of the project and instructions for setup and usage.

## Features

- Timer for plank sessions with a target time indicator
- Quick session rating to provide immediate feedback after each session
- Historical data views, including:
  - A calendar layout of plank sessions showing which days had planks
  - Daily session details
  - A 30-day session duration line chart with daily averages
  - Day/week/month filtering tabs for deeper session analysis
- Streak calculations to track consecutive days of planks
- Simple design focusing on clarity and usability
- Service worker registration for offline PWA functionality

## Technologies

- React 18
- TypeScript
- Vite for development and bundling
- ESLint & Prettier for consistent code style
- MUI (Material-UI) for some UI components

## Getting Started

1. Install dependencies:

   ```
   pnpm install
   ```

2. Run the local development server:

   ```
   pnpm dev
   ```

3. Open your browser at the provided local URL (usually http://127.0.0.1:5173/ by default).

4. Build for production:

   ```
   pnpm build
   ```

5. Preview the production build locally:

   ```
   pnpm preview
   ```

## Directory Structure

- **src/** – Main source code directory
  - **components/** – Common UI components (timer, rating dialog, progress chart, etc.)
  - **pages/** – Page-level components (MainPage, HistoricalPage)
  - **models/** – Data models and utility functions (e.g., streak computation)
  - **hooks/** – Custom hooks for notifications, timing, etc.
  - **store/** – State management (e.g., plank-store)
- **public/** – Static assets such as icons and manifest
- **scripts/** – Scripts for generating PWA icons
- **prompts/** – Additional documentation or requirement outlines

## ESLint Config & Setup

This project uses ESLint with recommended rules for React and TypeScript. If you wish to enable type-aware lint rules, see the inline documentation in `eslint.config.js` and consider adjusting the configuration as needed.

## Contributing

Contributions, bug reports, and feature requests are welcome. Please open issues or pull requests to discuss improvements or updates.

## License

This project is provided under an open license (check the repository for more details). Feel free to adapt the code to your own uses.

---
