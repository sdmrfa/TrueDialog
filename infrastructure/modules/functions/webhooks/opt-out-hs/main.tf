# File: Infrastructure/modules/functions/webhooks/opt-out-hs

resource "azurerm_storage_account" "astg" {
  name                     = "${var.rg_name}astg"
  resource_group_name      = var.rg_name
  location                 = var.ohs_astg_location
  account_tier             = var.ohs_astg_tier
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "astgc" {
  name                  = "${var.rg_name}astgc"
  storage_account_id    = azurerm_storage_account.astg.id
  container_access_type = "private"
}

resource "azurerm_service_plan" "asp" {
  name                = var.ohs_asp_name
  resource_group_name = var.rg_name
  location            = var.ohs_asp_location
  os_type             = "Linux"
  sku_name            = var.ohs_asp_sku
}

resource "azurerm_function_app_flex_consumption" "opt_out_hs_webhook" {
  name                = var.ohs_name
  resource_group_name = var.rg_name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.astg.primary_blob_endpoint}${azurerm_storage_container.astgc.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.astg.primary_access_key
  runtime_name                = var.ohs_runtime_name
  runtime_version             = var.ohs_node_version
  maximum_instance_count      = var.ohs_maximum_instance_count
  instance_memory_in_mb       = var.ohs_instance_memory_in_mb

  site_config {
    app_command_line = "npm install && npm start"
  }
}
