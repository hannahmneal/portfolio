output "pages_url" {
  description = "Your Cloudflare Pages URL"
  value       = "https://${cloudflare_pages_project.portfolio.subdomain}"  # ❗️ This points to the my assigned subdomain "porfolio-3dk.pages.dev" ("portfolio.pages.dev" is owned by someone else.)
}

output "api_url" {
  description = "Public URL for the portfolio API once DNS has propagated"
  value       = "https://${var.api_subdomain}.${var.domain}"
}
