# File: Infrastructure/modules/app_gateway/outputs.tf

output "public_ip" {
  description = "Public IP of the Application Gateway"
  value       = azurerm_public_ip.app_gateway.ip_address
}