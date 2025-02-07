# Plank Training App

[![Netlify Status](https://api.netlify.com/api/v1/badges/1803d138-8696-4bf2-a409-bf7501ad8868/deploy-status)](https://app.netlify.com/sites/theplankapp/deploys)

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
- User authentication with email/password and Google Sign-In

## Technologies

- React 18
- TypeScript
- Vite for development and bundling
- ESLint & Prettier for consistent code style
- MUI (Material-UI) for some UI components
- Supabase for authentication and data storage

## Getting Started

1. Install dependencies:

   ```
   pnpm install
   ```

2. Set up your Supabase project and add the following environment variables to a `.env.local` file:

   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the local development server:

   ```
   pnpm dev
   ```

4. Open your browser at the provided local URL (usually http://127.0.0.1:5173/ by default).

5. Build for production:

   ```
   pnpm build
   ```

6. Preview the production build locally:

   ```
   pnpm preview
   ```

## Setting up Google Sign-In

1. Go to your Supabase project settings (https://supabase.com/dashboard)
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Set up OAuth credentials in Google Cloud Console (https://console.cloud.google.com/):
   - Create a new project or use an existing one
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID (Web application type)
   - Add authorized JavaScript origins (your app's URL)
   - Add authorized redirect URIs (your Supabase project URL + /auth/v1/callback)
5. Copy the Client ID and Client Secret from Google Cloud Console
6. Paste these credentials in your Supabase Google provider settings

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
