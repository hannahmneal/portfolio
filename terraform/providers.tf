terraform {
  required_version = ">= 1.6"

  cloud {
    organization = "RedQueenVentures"
    workspaces {
      name = "portfolio"
    }
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    render = {
      source  = "render-oss/render"
      version = "~> 1.8"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.18"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "render" {
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
}

provider "neon" {
  api_key = var.neon_api_key
}
