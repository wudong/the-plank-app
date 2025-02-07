# Changelog

All notable changes to this project will be documented in this file.

## [Added]

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
