# File: Infrastructure/modules/app_service/outputs.tf

output "webapp_url" {
  description = "Default hostname of the Web App"
  value       = "https://${azurerm_linux_web_app.webapp.default_hostname}"
}

output "webapp_name" {
  description = "Name of the Web App"
  value       = azurerm_linux_web_app.webapp.name
}