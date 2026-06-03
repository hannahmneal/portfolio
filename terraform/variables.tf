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
  description = "hannahmneal"
  type        = string
}

variable "github_repo" {
  description = "Repository name"
  type        = string
  default     = "portfolio"
}
