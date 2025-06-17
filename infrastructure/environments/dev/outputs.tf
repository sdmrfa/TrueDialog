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

output "backend_web_app_url" {
  description = "URL of the Backend Web App"
  value       = module.backend_app_service.backend_web_app_url
}

output "frontend_web_app_url" {
  description = "URL of the Frontend Web App"
  value       = module.frontend_app_service.frontend_web_app_url
}

output "webhook_function_app_url" {
  description = "URL of the Function App"
  value       = module.webhook_function_app.webhook_function_app_url
}

output "webhook_truedialog_url" {
  description = "URL for the TrueDialog webhook"
  value       = "${module.apim.apim_gateway_url}/api/webhook/truedialog"
}

output "webhook_hubspot_url" {
  description = "URL for the HubSpot webhook"
  value       = "${module.apim.apim_gateway_url}/api/webhook/hubspot"
}

output "cosmosdb_account_endpoint" {
  description = "Endpoint of the Cosmos DB account"
  value       = module.cosmos_db.cosmosdb_account_endpoint
}

output "cosmosdb_account_key" {
  description = "Primary key of the Cosmos DB account"
  value       = module.cosmos_db.cosmosdb_account_key
  sensitive   = true
}

output "cosmosdb_database_name" {
  description = "Name of the Cosmos DB database"
  value       = module.cosmos_db.database_name
}

output "cosmosdb_container_name" {
  description = "Name of the Cosmos DB container"
  value       = module.cosmos_db.container_name
}