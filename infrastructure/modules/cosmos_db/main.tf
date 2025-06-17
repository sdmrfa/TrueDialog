# File: Infrastructure/modules/cosmos_db/main.tf

resource "azurerm_cosmosdb_account" "main" {
  name                      = var.account_name
  location                  = var.location
  resource_group_name       = var.resource_group_name
  offer_type                = var.offer_type
  kind                      = var.kind
  
  automatic_failover_enabled = true

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  depends_on = [
    var.resource_group_name
  ]
}

resource "azurerm_cosmosdb_sql_container" "main" {
  name                  = var.container_name
  resource_group_name   = var.resource_group_name
  account_name          = var.account_name
  database_name         = var.database_name
  partition_key_path    = var.partition_key_path
  partition_key_version = 1
  autoscale_settings {
    max_throughput = var.max_throughput
  }

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    included_path {
      path = "/included/?"
    }

    excluded_path {
      path = "/excluded/?"
    }
  }

  unique_key {
    paths = ["/definition/idlong", "/definition/idshort"]
  }
}

resource "azurerm_cosmosdb_sql_database" "main" {
  name                = var.database_name
  resource_group_name = var.resource_group_name
  account_name        = var.account_name
  autoscale_settings {
    max_throughput = var.max_throughput
  }
}

