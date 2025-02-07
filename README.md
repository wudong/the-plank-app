# Plank App

## Netlify Deployment with Terraform

This project uses Terraform to manage the deployment of the Plank App to Netlify. The configuration handles automatic deployments, environment variables, and build settings.

### Prerequisites

1. Install Terraform (version 1.0 or later)
2. Create a Netlify account and obtain a personal access token
3. Have your Supabase project URL and anonymous key ready

### Setup

1. Copy the example variables file:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your values:

   - `netlify_token`: Your Netlify personal access token
   - `github_repo_path`: Your GitHub repository path (e.g., "username/plank-app")
   - `supabase_url`: Your Supabase project URL
   - `supabase_anon_key`: Your Supabase anonymous key

3. Initialize Terraform:

   ```bash
   terraform init
   ```

4. Review the deployment plan:

   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

### Outputs

After successful deployment, Terraform will output:

- `site_url`: The URL of your deployed site
- `site_id`: The Netlify site ID
- `deploy_url`: The URL for the latest deployment

### Updating the Site

To update the site configuration or redeploy:

1. Make your changes to the Terraform files or application code
2. Run `terraform apply` to apply the changes
3. Commit and push your code - Netlify will automatically deploy updates
