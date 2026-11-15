locals {
  pages_function_env = {
    "API_BASE_URL" = { type = "plain_text", value = "https://${var.api_subdomain}.${var.domain}" }
    "API_KEY"      = { type = "secret_text", value = var.api_proxy_key }
  }
}

resource "cloudflare_pages_project" "portfolio" {
  account_id        = var.cloudflare_account_id
  name              = "portfolio"
  production_branch = "main"

  build_config = {
    build_command   = "npm run build"
    destination_dir = "dist"
    root_dir        = "frontend"
  }

  # Environment for builds AND Pages Functions. The function in
  # frontend/functions/api/[[path]].js uses these to reach the private API.
  # API_KEY is READ-scoped (see var.api_proxy_key) because this component is
  # reachable by anyone, and is stored as secret_text so Cloudflare does not
  # hand it back on read.
  #
  # Preview deployments get the same values: preview URLs are public, which is
  # exactly why the key is read-only.
  #
  # Rotating: add the new key to the API's API_KEYS first, change
  # api_proxy_key here, then drop the old key from API_KEYS - that order means
  # no live deployment ever holds a key the API no longer accepts.
  deployment_configs = {
    production = { env_vars = local.pages_function_env }
    preview    = { env_vars = local.pages_function_env }
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

  # The cloudflare provider's Read for this resource never settles these
  # fields back to a stable value - every plan shows them flipping to
  # "(known after apply)" even right after a clean apply, which isn't real
  # drift (the Pages project itself isn't changing). Ignore them so `plan`
  # stays quiet; the attributes we actually manage above are unaffected.
  lifecycle {
    ignore_changes = [
      build_config.build_caching,
      build_config.web_analytics_tag,
      build_config.web_analytics_token,
      source.config.deployments_enabled,
      source.config.owner_id,
      source.config.path_excludes,
      source.config.path_includes,
      source.config.preview_branch_excludes,
      source.config.preview_branch_includes,
      source.config.preview_deployment_setting,
      source.config.repo_id,
    ]
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