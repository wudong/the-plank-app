# Changelog

All notable changes to this project will be documented in this file.

## [Added]

- Added data management page with Supabase storage integration

  - Created new DataManagePage component for managing local and remote data
  - Implemented save to remote and load from remote functionality
  - Added timestamp tracking for remote data saves
  - Moved clean data functionality from sidebar to data management page
  - Updated navigation to include new data management section

- Terraform configuration for Netlify deployment management
  - Created main.tf with Netlify site configuration
  - Added variables.tf for configuration parameters
  - Added outputs.tf for deployment information
  - Created terraform.tfvars.example as a template for configuration
  - Updated .gitignore with Terraform-specific entries

## [Fixed]

- Fixed authentication state display in Sidebar component
  - Corrected menu item to show "Sign Out" when user is logged in
  - Simplified authentication-related code for better maintainability
