# DNS for api.redqueen.run -> Render, proxied through Cloudflare so the API
# gets TLS/WAF/DDoS protection without a Worker.
resource "cloudflare_dns_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = var.api_subdomain
  type    = "CNAME"
  content = trimsuffix(trimprefix(render_web_service.portfolio_api.url, "https://"), "/")
  ttl     = 1 # automatic, required when proxied
  proxied = true
}
