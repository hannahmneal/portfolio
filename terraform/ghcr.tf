# Lets Render pull the backend image while it stays PRIVATE on GHCR.
#
# Without this, the only free path is making ghcr.io/<owner>/portfolio-api
# public by hand (see the note at the top of render.tf). That step has to be
# redone whenever the package is recreated, and GitHub exposes no REST
# endpoint for package visibility, so it cannot be scripted - hence this
# credential instead.
#
# APPLY WARNING: attaching this to the existing service is an *update* to
# render_web_service.portfolio_api, which the render-oss provider cannot
# perform on the free plan (see render.tf). The first apply after this lands
# must therefore be:
#
#   terraform apply -replace="render_web_service.portfolio_api"
#
# That destroys and recreates the service, which CHANGES ITS DEPLOY HOOK URL.
# Update the RENDER_DEPLOY_HOOK_URL repo secret from the new value
# (Render dashboard > portfolio-api > Settings > Deploy Hook) immediately
# afterwards, or the "Trigger Render deploy" step in deploy.yml will 404.
resource "render_registry_credential" "ghcr" {
  name       = "ghcr-${var.github_owner}"
  registry   = "GITHUB"
  username   = var.github_owner
  auth_token = var.ghcr_read_token
}
