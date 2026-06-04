resource "cloudflare_pages_project" "portfolio" {
  account_id        = var.cloudflare_account_id
  name              = "portfolio"
  production_branch = "main"

  build_config = {
    build_command   = "npm run build"
    destination_dir = "dist"
    root_dir        = "frontend"
  }

  source = {
    type = "github"
    config = {
      owner               = var.github_owner
      repo_name           = var.github_repo
      production_branch   = "main"
      pr_comments_enabled = true
      production_deployments_enabled = true
    }
  }
}

# yourname.com → Pages
resource "cloudflare_dns_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain
  content = cloudflare_pages_project.portfolio.subdomain  # ❗️ This points to the my assigned subdomain "porfolio-3dk.pages.dev" ("portfolio.pages.dev" is owned by someone else.)
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

# www.yourname.com → Pages
resource "cloudflare_dns_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = cloudflare_pages_project.portfolio.subdomain  # ❗️ This points to the my assigned subdomain "porfolio-3dk.pages.dev" ("portfolio.pages.dev" is owned by someone else.)
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  name         = var.domain
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.portfolio.name
  name         = "www.${var.domain}"
}