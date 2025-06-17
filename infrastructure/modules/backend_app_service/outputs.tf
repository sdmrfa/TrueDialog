# File: Infrastructure/modules/backend_app_service/outputs.tf

output "backend_web_app_url" {
  description = "Default hostname of the Backend Web App"
  value       = "https://${azurerm_linux_web_app.backend_web_app.default_hostname}"
}

output "backend_web_app_name" {
  description = "Name of the Web App"
  value       = azurerm_linux_web_app.backend_web_app.name
}