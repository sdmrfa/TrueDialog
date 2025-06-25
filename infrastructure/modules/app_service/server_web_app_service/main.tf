# File: Infrastructure/modules/server_app_service/main.tf

resource "azurerm_service_plan" "asp" {
  name                = var.swa_asp_name
  resource_group_name = var.rg_name
  location            = var.swa_asp_location
  os_type             = "Linux"
  sku_name            = var.swa_asp_sku
}

resource "azurerm_linux_web_app" "server_web_app" {
  name                = var.swa_name
  resource_group_name = var.rg_name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      node_version = var.swa_node_version
    }

    always_on           = var.swa_always_on
    app_command_line    = "npm install && npm start"
    minimum_tls_version = "1.2"
  }

  app_settings = {
    "SCM_DO_BUILD_DURING_DEPLOYMENT"      = "false"
    "WEBSITE_NODE_DEFAULT_VERSION"        = var.swa_node_version
    "WEBSITES_PORT"                       = var.swa_port
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "true"
    "ENABLE_ORYX_BUILD"                   = "false"
    "ENABLE_NODE_LOGGING"                 = "true"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_monitor_autoscale_setting" "autoscale" {
  name                = "${var.swa_asp_name}as"
  resource_group_name = var.rg_name
  location            = azurerm_service_plan.asp.location
  target_resource_id  = azurerm_service_plan.asp.id

  profile {
    name = "default"

    capacity {
      default = var.swa_instance_count
      minimum = var.swa_instance_count
      maximum = var.swa_max_instance_count
    }

    rule {
      metric_trigger {
        metric_name        = "HttpQueueLength"
        metric_resource_id = azurerm_service_plan.asp.id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "GreaterThan"
        threshold          = 50
      }

      scale_action {
        direction = "Increase"
        type      = "ChangeCount"
        value     = "2"
        cooldown  = "PT5M"
      }
    }

    rule {
      metric_trigger {
        metric_name        = "HttpQueueLength"
        metric_resource_id = azurerm_service_plan.asp.id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "LessThan"
        threshold          = 20
      }

      scale_action {
        direction = "Decrease"
        type      = "ChangeCount"
        value     = "2"
        cooldown  = "PT5M"
      }
    }
  }
}
