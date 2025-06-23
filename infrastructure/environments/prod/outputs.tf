# File: Infrastructure/environment/Prod/outputs.tf

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