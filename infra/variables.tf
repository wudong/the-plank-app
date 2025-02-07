variable "netlify_token" {
  description = "Netlify Personal Access Token"
  type        = string
  sensitive   = true
}

variable "site_name" {
  description = "Name of the Netlify site"
  type        = string
}

variable "custom_domain" {
  description = "App Domain"
  type        = string
  sensitive   = false
}

variable "github_repo_path" {
  description = "GitHub repository path (e.g., 'username/repo')"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  sensitive   = true
}
