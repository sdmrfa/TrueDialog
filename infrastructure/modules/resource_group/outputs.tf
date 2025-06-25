# File: Infrastructure/modules/resource_group/outputs.tf

output "rg_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.resource_group.name
}