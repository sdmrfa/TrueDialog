# File: Infrastructure/modules/api_management/main.tf


resource "azurerm_api_management" "apim" {
  name                = var.apim_name
  resource_group_name = var.resource_group_name
  location            = var.location
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  sku_name            = var.apim_sku
}

resource "azurerm_api_management_api" "api" {
  name                = "${var.apim_name}-api"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.apim.name
  revision            = "1"
  display_name        = "App Service API"
  path                = "api"
  protocols           = ["https"]
}

resource "azurerm_api_management_backend" "backend" {
  name                = "${var.apim_name}-backend"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.apim.name
  protocol            = "http"
  url                 = var.backend_app_service
}

resource "azurerm_api_management_api_operation" "operation" {
  operation_id        = "get-operation"
  api_name            = azurerm_api_management_api.api.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name
  display_name        = "Get Operation"
  method              = "GET"
  url_template        = "/*"
}

resource "azurerm_api_management_api_policy" "policy" {
  api_name            = azurerm_api_management_api.api.name
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = var.resource_group_name

  xml_content = <<XML
<policies>
  <inbound>
    <base />
    <set-backend-service id="apim-generated-policy" backend-id="${azurerm_api_management_backend.backend.name}" />
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