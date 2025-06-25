# File: Infrastructure/modules/frontend_app_service/outputs.tf

output "frontend_web_app_url" {
  description = "Default hostname of the Web App"
  value       = "https://${azurerm_linux_web_app.frontend_web_app.default_hostname}"
}

output "frontend_web_app_name" {
  description = "Name of the Web App"
  value       = azurerm_linux_web_app.frontend_web_app.name
}
