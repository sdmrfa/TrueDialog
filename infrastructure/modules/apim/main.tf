# Azure API Management Instance
resource "azurerm_api_management" "main" {
  name                = var.apim_name
  location            = var.location
  resource_group_name = var.resource_group_name
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  sku_name            = var.apim_sku
  identity {
    type = "SystemAssigned"
  }
}
# ========================
# FRONTEND API
# ========================
resource "azurerm_api_management_api" "frontend" {
  name                = "frontend-app"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "Frontend App"
  path                = "frontend"
  protocols           = ["https"]
  service_url         = var.frontend_url
}
resource "azurerm_api_management_api_policy" "frontend_policy" {
  api_name            = azurerm_api_management_api.frontend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.frontend_url}" />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
XML
}
resource "azurerm_api_management_api_operation" "frontend_get_root" {
  operation_id        = "get-frontend"
  api_name            = azurerm_api_management_api.frontend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name = "GET Frontend Root"
  method       = "GET"
  url_template = "/"
  response {
    status_code      = 200
    description = "Frontend Root Loaded"
  }
}
# ========================
# BACKEND API
# ========================
resource "azurerm_api_management_api" "backend" {
  name                = "backend-api"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "Backend API"
  path                = "backend"
  protocols           = ["https"]
  service_url         = var.backend_url
}
resource "azurerm_api_management_api_policy" "backend_policy" {
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.backend_url}" />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
XML
}
resource "azurerm_api_management_api_operation" "backend_get" {
  operation_id        = "get-backend"
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name = "GET Backend Endpoint"
  method       = "GET"
  url_template = "/"
  response {
    status_code      = 200
    description = "Backend Data Fetched"
  }
}
# ========================
# WEBHOOK API
# ========================
resource "azurerm_api_management_api" "webhook" {
  name                = "webhook-api"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "Webhook API"
  path                = "api/webhook"
  protocols           = ["https"]
  service_url         = var.webhook_url
}
resource "azurerm_api_management_api_policy" "webhook_policy" {
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.webhook_url}/api/webhook" />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
XML
}
resource "azurerm_api_management_api_operation" "webhook_post_dynamic" {
  operation_id        = "post-webhook-dynamic"
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name = "POST Webhook"
  method       = "POST"
  url_template = "/{source}"
  template_parameter {
    name     = "source"
    required = true
    type     = "string"
  }
  request {
    description = "Dynamic Webhook POST"
  }
  response {
    status_code = 200
    description = "Webhook from dynamic source processed"
  }
}