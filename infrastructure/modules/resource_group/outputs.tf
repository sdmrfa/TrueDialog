# File: Infrastructure/modules/resource_group/outputs.tf

output "resource_group_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.main.name
}