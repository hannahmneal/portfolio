variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages:Edit and DNS:Edit permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Zone ID for your domain"
  type        = string
}

variable "domain" {
  description = "The apex domain, e.g. yourname.com"
  type        = string
}

variable "github_owner" {
  description = "The entity on GitHub that owns the repo"
  type        = string
}

variable "github_repo" {
  description = "Repository name"
  type        = string
  default     = "portfolio"
}

variable "render_api_key" {
  description = "Render API key (Account Settings > API Keys)"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render workspace/owner ID that will own the web service"
  type        = string
}

variable "neon_api_key" {
  description = "Neon API key (Account Settings > API Keys)"
  type        = string
  sensitive   = true
}

variable "neon_org_id" {
  description = "The id of the organization of the Neon project"
  type        = string
}

variable "image_repository" {
  description = "GHCR image reference to deploy, e.g. ghcr.io/hannahmneal/portfolio-api"
  type        = string
}

variable "api_subdomain" {
  description = "Single-level subdomain under var.domain for the portfolio API"
  type        = string
  default     = "api"
}

variable "ghcr_read_token" {
  description = <<-DESC
    GitHub token with read:packages, used by Render to pull the private
    backend image from GHCR. Set this as a sensitive workspace variable in
    Terraform Cloud (RedQueenVentures org > portfolio workspace > Variables).
    Supplying this removes the need to make the GHCR package public by hand
    after every package recreation.
  DESC
  type        = string
  sensitive   = true
}
