# File: Infrastructure/modules/apim/main.tf

# ========================
# API MANAGEMENT INSTANCE
# ========================
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
  name                = "frontend-api"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "Frontend App"
  path                = "frontend"
  protocols           = ["https"]
  service_url         = var.frontend_url
  subscription_required = false
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
    <rewrite-uri template="/" copy-unmatched-params="true" />
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

resource "azurerm_api_management_api_operation" "frontend_get" {
  operation_id        = "frontend-get-all"
  api_name            = azurerm_api_management_api.frontend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "Wildcard GET"
  method              = "GET"
  url_template        = "/*"

  response {
    status_code = 200
    description = "Wildcard GET for frontend"
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
  subscription_required = false
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
    <rewrite-uri template="/" copy-unmatched-params="true" />
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
  operation_id        = "backend-get-all"
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "Wildcard GET"
  method              = "GET"
  url_template        = "/*"

  response {
    status_code = 200
    description = "Wildcard GET for backend"
  }
}

resource "azurerm_api_management_api_operation" "backend_post" {
  operation_id        = "backend-post-all"
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "Wildcard POST"
  method              = "POST"
  url_template        = "/*"

  request {
    description = "Wildcard POST body"
  }

  response {
    status_code = 200
    description = "Wildcard POST for backend"
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
  path                = "webhook"
  protocols           = ["https"]
  service_url         = var.webhook_url
  subscription_required = false
}

resource "azurerm_api_management_api_policy" "webhook_policy" {
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.webhook_url}" />
    <rewrite-uri template="/api/webhook" copy-unmatched-params="true" />
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

resource "azurerm_api_management_api_operation" "webhook_post" {
  operation_id        = "webhook-post-all"
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "Wildcard POST"
  method              = "POST"
  url_template        = "/*"

  request {
    description = "Wildcard POST body"
  }

  response {
    status_code = 200
    description = "Wildcard POST for webhook"
  }
}