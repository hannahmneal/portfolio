# NOTE: Render needs credentials to pull a *private* GHCR image (there's a
# render_registry_credential resource for that, plus registry_credential_id
# on runtime_source.image below). Simplest free path: after the first image
# push, open the package on GitHub (Package settings > Change visibility) and
# make ghcr.io/<owner>/portfolio-api public, so no credential is needed at all.
#
# The image tag is pinned to "latest" and never changes here on purpose: the
# render-oss provider (as of v1.9.x) unconditionally resends a
# maintenance_mode field on every *update* to a web service, which Render's
# API rejects outright on the free plan. Since Create works fine and only
# Update is broken, this resource is defined so ordinary CI pushes never need
# to change it - new deploys happen via the Render deploy hook in the GitHub
# Actions workflow instead of a Terraform update. If you do need to change
# something else here (region, plan, custom_domains, etc.), expect the update
# to fail with "maintenance mode can only be configured for non-free tier
# services" - use `terraform apply -replace="render_web_service.portfolio_api"`
# to force a destroy+recreate instead (this will change the service's
# URL/deploy hook).
resource "render_web_service" "portfolio_api" {
  name   = "portfolio-api"
  plan   = "free"
  region = "oregon"

  runtime_source = {
    image = {
      image_url = var.image_repository
      tag       = "latest"
      # Lets Render pull the image while it stays private on GHCR - see the
      # APPLY WARNING in ghcr.tf before the first apply with this attached.
      registry_credential_id = render_registry_credential.ghcr.id
    }
  }

  env_vars = {
    "DATABASE_URL" = { value = neon_project.portfolio.connection_uri_pooler }
    "NODE_ENV"     = { value = "production" }
  }

  custom_domains = [
    { name = "${var.api_subdomain}.${var.domain}" },
  ]
}

output "render_service_hostname" {
  value = render_web_service.portfolio_api.url
}
