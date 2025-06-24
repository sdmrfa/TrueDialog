# File: Infrastructure/modules/server_app_service/main.tf

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

    always_on           = var.always_on
    app_command_line    = "npm install && npm start"
    minimum_tls_version = "1.2"
    health_check_path   = var.health_check_path
  }

  app_settings = {
    "SCM_DO_BUILD_DURING_DEPLOYMENT"      = "false"
    "WEBSITE_NODE_DEFAULT_VERSION"        = var.node_version_asp
    "WEBSITES_PORT"                       = var.server_app_port
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "true"
    "APPINSIGHTS_INSTRUMENTATIONKEY"      = azurerm_application_insights.app_insights.instrumentation_key
    "ENABLE_ORYX_BUILD"                   = "false"
    "ENABLE_NODE_LOGGING"                 = "true"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_monitor_autoscale_setting" "autoscale" {
  name                = "${var.app_service_plan_name}-autoscale"
  resource_group_name = var.resource_group_name
  location            = var.location
  target_resource_id  = azurerm_service_plan.asp.id

  profile {
    name = "default"

    capacity {
      default = var.instance_count
      minimum = var.instance_count
      maximum = var.maximum_count
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

resource "azurerm_application_insights" "app_insights" {
  name                = "${var.server_app_name}-appinsights"
  resource_group_name = var.resource_group_name
  location            = var.location
  application_type    = "web"
}
