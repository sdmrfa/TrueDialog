# File: Infrastructure/modules/webhook_function_app/main.tf

resource "azurerm_storage_account" "storage" {
  name                     = "${var.webhook_function_app_name}storage"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "function_plan" {
  name                = "${var.webhook_function_app_name}plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = var.function_sku
}

resource "azurerm_linux_function_app" "webhook_function_app" {
  name                = var.webhook_function_app_name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.function_plan.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key

  site_config {
    application_stack {
      node_version = var.node_version_fn
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"     = "node"
    "WEBSITE_NODE_DEFAULT_VERSION" = var.node_version_fn
  }

  identity {
    type = "SystemAssigned"
  }
}