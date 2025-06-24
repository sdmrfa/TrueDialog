resource "azurerm_service_plan" "asp" {
  name                = var.app_service_plan_name
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
}

resource "azurerm_linux_web_app" "server_web_app" {
  name                = var.server_app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      node_version = var.node_version_asp
    }

    always_on         = var.always_on
    health_check_path = "/health"
  }

  app_settings = {
    "WEBSITES_PORT"   = var.server_app_port
  }

  identity {
    type = "SystemAssigned"
  }
}
