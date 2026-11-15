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

variable "api_keys" {
  description = <<-EOT
    Comma-separated API keys that may call the portfolio API, as
    `label:scope:key` entries where scope is `read` or `write`:

      "pages-proxy:read:<key>,laptop:write:<key>"

    The API refuses to start if this is empty, if any entry omits its scope, or
    if any key is shorter than 32 characters. Generate keys with
    `openssl rand -hex 32`. Must include the read-scoped key that
    `api_proxy_key` also holds. Store this as a sensitive workspace variable in
    Terraform Cloud, never in terraform.tfvars in the repo.
  EOT
  type        = string
  sensitive   = true
}

variable "api_proxy_key" {
  description = <<-EOT
    The single API key the Cloudflare Pages Function proxy uses to call the
    backend API. Just the key, with no label or scope prefix.

    Must be READ-scoped: the same key must appear in `api_keys` as
    `pages-proxy:read:<key>`. The proxy is reachable by anyone, so a
    write-scoped key here would mean a mistake in the proxy's allowlist becomes
    write access to your content. Its own label keeps it revocable on its own.

    Sensitive: store it as a Terraform Cloud workspace variable.
  EOT
  type        = string
  sensitive   = true
}
