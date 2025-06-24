# File: Infrastructure/modules/apim/outputs.tf

output "apim_gateway_url" {
  description = "URL of the API Management gateway"
  value       = "https://${azurerm_api_management.apim.name}.azure-api.net"
}