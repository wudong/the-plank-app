terraform {
  required_providers {
    netlify = {
      source  = "netlify/netlify"
      version = "~> 0.2"
    }
  }
}

provider "netlify" {
  token             = var.netlify_token
  default_team_slug = "wudong"
}

data "netlify_site" "plank_app" {
  name = "theplankapp"
}

resource "netlify_site_build_settings" "plank_app_build_settings" {
  site_id           = data.netlify_site.plank_app.id # Reference the site you just created
  build_command     = "pnpm run build"               # Use the commands here
  publish_directory = "dist"                         # And the publish directory here
  production_branch = var.github_branch              # Match the production branch
}

resource "netlify_site_domain_settings" "plank_app_domains" {
  site_id       = data.netlify_site.plank_app.id
  custom_domain = var.custom_domain
}

resource "netlify_environment_variable" "supabase_url" {
  site_id = data.netlify_site.plank_app.id
  key     = "VITE_SUPABASE_URL"
  values = [
    {
      value   = var.supabase_url,
      context = "all",
    }
  ]
}

resource "netlify_environment_variable" "supabase_anon_key" {
  site_id = data.netlify_site.plank_app.id
  key     = "VITE_SUPABASE_ANON_KEY"
  values = [
    {
      value   = var.supabase_anon_key,
      context = "all",
    }
  ]
}
