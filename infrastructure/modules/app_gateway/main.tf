# File: Infrastructure/modules/app_gateway/main.tf

resource "azurerm_public_ip" "app_gateway" {
  name                = "${var.app_gateway_name}pip"
  resource_group_name = var.resource_group_name
  location            = var.location
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "${var.app_gateway_name}vnet"
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "app_gateway" {
  name                 = "app-gateway-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_application_gateway" "app_gateway" {
  name                = var.app_gateway_name
  resource_group_name = var.resource_group_name
  location            = var.location

  sku {
    name     = var.app_gateway_sku
    tier     = "WAF_v2"
    capacity = var.app_gateway_capacity
  }

  gateway_ip_configuration {
    name      = "app-gateway-ip-config"
    subnet_id = azurerm_subnet.app_gateway.id
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "frontend-ip"
    public_ip_address_id = azurerm_public_ip.app_gateway.id
  }

  backend_address_pool {
    name  = "app-service-pool"
    fqdns = var.backend_app_services
  }

  backend_http_settings {
    name                  = "http-setting"
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 20
    probe_name            = "health-probe"
  }

  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip"
    frontend_port_name            = "http-port"
    protocol                      = "Http"
  }

  request_routing_rule {
    name                       = "rule1"
    rule_type                  = "Basic"
    http_listener_name         = "http-listener"
    backend_address_pool_name  = "app-service-pool"
    backend_http_settings_name = "http-setting"
    priority                   = 1
  }

  probe {
    name                = "health-probe"
    protocol            = "Http"
    path                = "/health"
    interval            = 30
    timeout             = 30
    unhealthy_threshold = 3
    host                = var.backend_app_services[0]
  }
}