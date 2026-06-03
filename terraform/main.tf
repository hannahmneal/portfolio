output "tunnel_token" {
  description = "Paste into cloudflared on your home server: terraform output -raw tunnel_token"
  value       = cloudflare_zero_trust_tunnel_cloudflared.home.tunnel_token
  sensitive   = true
}

output "pages_url" {
  description = "Your Cloudflare Pages URL"
  value       = "https://${cloudflare_pages_project.portfolio.name}.pages.dev"
}
