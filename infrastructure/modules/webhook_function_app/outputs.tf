# File: Infrastructure/modules/backend_app_service/outputs.tf

output "webhook_function_app_url" {
  description = "Default hostname of the Function App"
  value       = "https://${azurerm_linux_function_app.webhook_function_app.default_hostname}"
}

output "webhook_function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.webhook_function_app.name
}