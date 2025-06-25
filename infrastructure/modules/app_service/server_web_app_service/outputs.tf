# File: Infrastructure/modules/server_app_service/outputs.tf

output "swa_url" {
  description = "Default hostname of the server Web App"
  value       = azurerm_linux_web_app.server_web_app.default_hostname
}

output "swa_name" {
  description = "Name of the Web App"
  value       = azurerm_linux_web_app.server_web_app.name
}