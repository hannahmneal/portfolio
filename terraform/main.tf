output "tunnel_token" {
  description = "Paste into cloudflared on your home server: terraform output -raw tunnel_token"
  value       = data.cloudflare_zero_trust_tunnel_cloudflared_token.home.token
  sensitive   = true
}

output "pages_url" {
  description = "Your Cloudflare Pages URL"
  value       = "https://${cloudflare_pages_project.portfolio.subdomain}"  # ❗️ This points to the my assigned subdomain "porfolio-3dk.pages.dev" ("portfolio.pages.dev" is owned by someone else.)
}
