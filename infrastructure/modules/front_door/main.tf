# File: Infrastructure/modules/front_door/main.tf


resource "azurerm_cdn_frontdoor_profile" "front_door" {
  name                = var.front_door_name
  resource_group_name = var.resource_group_name
  sku_name            = "Standard_AzureFrontDoor"
}

resource "azurerm_cdn_frontdoor_endpoint" "frontend" {
  name                      = "${var.front_door_name}-frontend"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.front_door.id
}

resource "azurerm_cdn_frontdoor_origin_group" "backend_pool" {
  name                      = "backendPool"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.front_door.id

  load_balancing {
    sample_size                 = 4
    successful_samples_required = 2
    additional_latency_in_milliseconds = 0
  }

  health_probe {
    path                = "/health"
    protocol            = "Http"
    interval_in_seconds = 30
    request_type        = "GET"
  }
}

resource "azurerm_cdn_frontdoor_origin" "backend" {
  for_each = toset(var.backend_app_services)

  name = "${var.front_door_name}-origin-${replace(replace(trimprefix(each.value, "https://"), ".", "-"), "/", "-")}"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.front_door.id
  origin_group_id          = azurerm_cdn_frontdoor_origin_group.backend_pool.id

  host_name                = trimprefix(each.value, "https://")
  origin_host_header       = trimprefix(each.value, "https://")
  http_port                = 80
  https_port               = 443
  enabled                  = true
  certificate_name_check_enabled = true

  priority = 1
  weight   = 50
}

resource "azurerm_cdn_frontdoor_route" "default_route" {
  name                          = "defaultRouting"
  cdn_frontdoor_profile_id      = azurerm_cdn_frontdoor_profile.front_door.id
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.frontend.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.backend_pool.id
  cdn_frontdoor_origin_ids      = [for origin in azurerm_cdn_frontdoor_origin.backend : origin.id]

  patterns_to_match        = ["/*"]
  supported_protocols      = ["Http", "Https"]
  https_redirect_enabled   = true
  forwarding_protocol      = "HttpsOnly"
  link_to_default_domain   = true

  cache {
    query_string_caching_behavior = "UseQueryString"
    query_strings                 = ["*"]
    compression_enabled           = true
    content_types_to_compress     = ["text/html", "application/javascript", "text/css", "application/json"]
  }
}
