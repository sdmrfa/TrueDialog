# File: Infrastructure/modules/backend_app_service/main.tf

resource "azurerm_service_plan" "asp" {
  name                = var.app_service_plan_name
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
}

resource "azurerm_linux_web_app" "backend_web_app" {
  name                = var.backend_app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      node_version = var.node_version_asp
    }
    
    app_command_line = "npm install && node dist/app.js"
    always_on = var.always_on
  }

  app_settings = {
    "WEBSITES_PORT" = var.backend_app_port
  }

  identity {
    type = "SystemAssigned"
  }

}