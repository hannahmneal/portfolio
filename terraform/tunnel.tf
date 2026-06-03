# Outbound-only tunnel — your home server connects to Cloudflare. No open ports needed on your home network.
resource "cloudflare_zero_trust_tunnel_cloudflared" "home" {
  account_id = var.cloudflare_account_id
  name       = "portfolio-home-server"
  config_src = "cloudflare"
}

data "cloudflare_zero_trust_tunnel_cloudflared_token" "home" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.home.id
}

# api.yourname.com → tunnel → localhost:3001 on your home server
resource "cloudflare_dns_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  content = "${cloudflare_zero_trust_tunnel_cloudflared.home.id}.cfargotunnel.com"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
