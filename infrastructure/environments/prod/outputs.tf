# File: Infrastructure/environment/Dev/outputs.tf

output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.resource_group.resource_group_name
}

output "server_web_app_url" {
  description = "URL of the server Web App"
  value       = module.server_app_service.server_web_app_url
}