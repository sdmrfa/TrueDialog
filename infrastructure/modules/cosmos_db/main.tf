# File: Infrastructure/modules/cosmos_db/main.tf

resource "azurerm_cosmosdb_account" "db" {
  name                = var.cosmos_db_account_name
  resource_group_name = var.resource_group_name
  location            = var.location
  offer_type          = var.cosmos_db_offer_type
  kind                = var.cosmos_db_kind

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  consistency_policy {
    consistency_level = "Session"
  }

  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = var.cosmos_db_database_name
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.db.name
  throughput          = var.cosmos_db_throughput
}

resource "azurerm_cosmosdb_sql_container" "container" {
  name                  = var.cosmos_db_container_name
  resource_group_name   = var.resource_group_name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_path    = var.cosmos_db_partition_key_path
  autoscale_settings {
    max_throughput = var.cosmos_db_max_throughput
  }
}