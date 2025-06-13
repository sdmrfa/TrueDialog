# File: Infrastructure/environment/Dev/outputs.tf

output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.resource_group.resource_group_name
}

output "apim_name" {
  description = "Name of the API Management instance"
  value       = module.apim.apim_name
}

output "apim_gateway_url" {
  description = "Gateway URL of the API Management instance"
  value       = module.apim.apim_gateway_url
}

output "webapp_url" {
  description = "URL of the Web App"
  value       = module.app_service.webapp_url
}

output "function_app_url" {
  description = "URL of the Function App"
  value       = module.function_app.function_app_url
}

output "webhook_truedialog_url" {
  description = "URL for the TrueDialog webhook"
  value       = "${module.apim.apim_gateway_url}/api/webhook/truedialog"
}

output "webhook_hubspot_url" {
  description = "URL for the HubSpot webhook"
  value       = "${module.apim.apim_gateway_url}/api/webhook/hubspot"
}