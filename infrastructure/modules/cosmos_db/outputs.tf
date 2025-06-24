# File: Infrastructure/modules/cosmos_db/outputs.tf

output "cosmos_db_endpoint" {
  description = "Endpoint of the Cosmos DB account"
  value       = azurerm_cosmosdb_account.db.endpoint
}