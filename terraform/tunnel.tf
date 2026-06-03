resource "random_id" "tunnel_secret" {
  byte_length = 35
}

# Outbound-only tunnel — your home server connects to Cloudflare.
# No open ports needed on your home network.
resource "cloudflare_zero_trust_tunnel_cloudflared" "home" {
  account_id = var.cloudflare_account_id
  name       = "portfolio-home-server"
  secret     = random_id.tunnel_secret.b64_std
}

# api.yourname.com → tunnel → localhost:3001 on your home server
resource "cloudflare_dns_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  content = "${cloudflare_zero_trust_tunnel_cloudflared.home.id}.cfargotunnel.com"
  type    = "CNAME"
  proxied = true
}
