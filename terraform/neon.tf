# This is a community-maintained provider, not an official Neon product.
resource "neon_project" "portfolio" {
  name       = "portfolio"
  org_id     = var.neon_org_id
  region_id  = "aws-us-east-2"
  pg_version = 17

  # Free plan caps point-in-time-restore history at 6h (21600s); the
  # provider's own default (86400s/24h) exceeds that and gets rejected.
  history_retention_seconds = 21600
}

output "neon_connection_uri" {
  description = "postgres:// URI for node-postgres (DATABASE_URL on the Render service)"
  value       = neon_project.portfolio.connection_uri_pooler
  sensitive   = true
}
