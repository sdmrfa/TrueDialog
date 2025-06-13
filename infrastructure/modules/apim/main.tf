# File: Infrastructure/modules/apim/main.tf

resource "azurerm_api_management" "main" {
  name                = var.apim_name
  resource_group_name = var.resource_group_name
  location            = var.location
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  sku_name            = var.apim_sku

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_api_management_api" "one_to_one" {
  name                = "one-to-one-sms"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "One-to-One SMS API"
  path                = "one-to-one"
  protocols           = ["https"]
  service_url         = "${var.backend_url}/one-to-one"
}

resource "azurerm_api_management_api" "mass" {
  name                = "mass-sms"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "Mass SMS API"
  path                = "mass"
  protocols           = ["https"]
  service_url         = "${var.backend_url}/mass"
}

resource "azurerm_api_management_api_policy" "one_to_one_policy" {
  api_name            = azurerm_api_management_api.one_to_one.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.backend_url}/one-to-one" />
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

resource "azurerm_api_management_api_policy" "mass_policy" {
  api_name            = azurerm_api_management_api.mass.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.backend_url}/mass" />
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

# Webhook API (routed to Function App)
resource "azurerm_api_management_api" "webhook" {
  name                = "webhook-api"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.main.name
  revision            = "1"
  display_name        = "Webhook API"
  path                = "api/webhook"
  protocols           = ["https"]
  service_url         = "${var.webhook_backend_url}/api/webhook"
}

resource "azurerm_api_management_api_operation" "webhook_truedialog_post" {
  operation_id        = "webhook-truedialog-post"
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "TrueDialog Webhook"
  method              = "POST"
  url_template        = "/truedialog"
  description         = "Handles TrueDialog opt-out webhook events"
}

resource "azurerm_api_management_api_operation" "webhook_hubspot_post" {
  operation_id        = "webhook-hubspot-post"
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "HubSpot Webhook POST"
  method              = "POST"
  url_template        = "/hubspot"
  description         = "Handles HubSpot opt-out webhook events"
}

resource "azurerm_api_management_api_operation" "webhook_hubspot_get" {
  operation_id        = "webhook-hubspot-get"
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name
  display_name        = "HubSpot Webhook GET"
  method              = "GET"
  url_template        = "/hubspot"
  description         = "Handles HubSpot webhook validation requests"
}

resource "azurerm_api_management_api_policy" "webhook_policy" {
  api_name            = azurerm_api_management_api.webhook.name
  api_management_name = azurerm_api_management.main.name
  resource_group_name = var.resource_group_name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service base-url="${var.webhook_backend_url}/api/webhook" />
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