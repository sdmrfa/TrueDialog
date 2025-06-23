# File: Infrastructure/modules/cosmos_db/outputs.tf

output "cosmosdb_account_endpoint" {
  description = "Endpoint of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "cosmosdb_account_key" {
  description = "Primary key of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.main.primary_key
  sensitive   = true
}

output "database_name" {
  description = "Name of the Cosmos DB database"
  value       = azurerm_cosmosdb_sql_database.main.name
}

output "container_name" {
  description = "Name of the Cosmos DB container"
  value       = azurerm_cosmosdb_sql_container.main.name
}