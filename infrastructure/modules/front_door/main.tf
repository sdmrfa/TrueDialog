# File: Infrastructure/modules/front_door/main.tf

resource "azurerm_cdn_frontdoor_profile" "front_door" {
  name                = var.front_door_name
  resource_group_name = var.resource_group_name
  sku_name            = var.sku_name
}

resource "azurerm_cdn_frontdoor_endpoint" "frontend" {
  name                     = "${var.front_door_name}ep"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.front_door.id
}

resource "azurerm_cdn_frontdoor_origin_group" "backend_pool" {
  name                     = "${var.front_door_name}ogg"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.front_door.id

  load_balancing {
    sample_size                        = 4
    successful_samples_required        = 2
    additional_latency_in_milliseconds = 0
  }

  health_probe {
    path                = var.health_probe_path
    protocol            = "Https"
    interval_in_seconds = 30
    request_type        = "HEAD"
  }

  session_affinity_enabled = var.session_affinity_enabled
}

resource "azurerm_cdn_frontdoor_origin" "backend" {
  for_each = toset(var.backend_origins)

  name                            = "${var.front_door_name}og"
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.backend_pool.id
  host_name                      = var.backend_host_name
  origin_host_header             = var.backend_host_name
  http_port                      = var.server_app_port
  https_port                     = 443
  enabled                        = true
  certificate_name_check_enabled = true
  priority                       = 1
  weight                         = 100
}

resource "azurerm_cdn_frontdoor_route" "default_route" {
  name                          = "${var.front_door_name}df"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.frontend.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.backend_pool.id
  cdn_frontdoor_origin_ids      = [for origin in azurerm_cdn_frontdoor_origin.backend : origin.id]

  patterns_to_match      = var.patterns_to_match
  supported_protocols    = ["Http", "Https"]
  https_redirect_enabled = true
  forwarding_protocol    = "HttpsOnly"
  link_to_default_domain = true
}

resource "azurerm_cdn_frontdoor_rule_set" "main" {
  name                     = "${var.front_door_name}rs"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.front_door.id
}

resource "azurerm_cdn_frontdoor_rule" "https_redirect" {
  name                        = "${var.front_door_name}hr"
  cdn_frontdoor_rule_set_id   = azurerm_cdn_frontdoor_rule_set.main.id
  order                       = 1

  conditions {
    request_scheme_condition {
      operator     = "Equal"
      match_values = ["HTTP"]
    }
  }

  actions {
    url_redirect_action {
      redirect_type       = "PermanentRedirect"
      redirect_protocol   = "Https"
      destination_hostname = azurerm_cdn_frontdoor_endpoint.frontend.host_name
    }
  }
}

