variable "cloudflare_api_token" {
    description = "The account API token from Cloudflare"
    type        = string
    default     = ""
}

variable "cloudflare_account_id" {
    description = "The Cloudflare account id"
    type        = string
    default     = ""
}

variable "cloudflare_zone_id" {
    description = "The Cloudflare zone id"
    type        = string
    default     = ""
}

variable "domain" {
    description = "The domain to deploy resources to"
    type        = string
    default     = "redqueen.run"
}