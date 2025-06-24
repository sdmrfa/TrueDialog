# File: Infrastructure/modules/app_gateway/outputs.tf

output "front_door_url" {
  description = "URL of the Front Door endpoint"
  value       = "https://${azurerm_cdn_frontdoor_endpoint.frontend.host_name}"
}