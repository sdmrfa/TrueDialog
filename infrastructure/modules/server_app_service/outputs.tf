# File: Infrastructure/modules/server_app_service/outputs.tf

output "server_web_app_url" {
  description = "Default hostname of the server Web App"
  value       = "https://${azurerm_linux_web_app.server_web_app.default_hostname}"
}

output "server_web_app_name" {
  description = "Name of the Web App"
  value       = azurerm_linux_web_app.server_web_app.name
}