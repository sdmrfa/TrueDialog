# File: Infrastructure/modules/app_service/outputs.tf

output "function_app_url" {
  description = "Default hostname of the Function App"
  value       = "https://${azurerm_linux_function_app.function_app.default_hostname}"
}

output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.function_app.name
}