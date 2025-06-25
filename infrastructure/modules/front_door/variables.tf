# File: Infrastructure/modules/app_gateway/variables.tf

variable "resource_group_name" {
  type        = string
  description = "The name of the resource group where Front Door resources will be created."
}

variable "front_door_name" {
  type        = string
  description = "The name prefix used for all Front Door related resources."
}

variable "sku_name" {
  type        = string
  description = "The SKU name for the Azure Front Door profile (e.g., 'Standard_AzureFrontDoor')."
}

variable "health_probe_path" {
  type        = string
  description = "The path used by Front Door for health probing the backend."
}

variable "session_affinity_enabled" {
  type        = bool
  description = "Whether session affinity is enabled on the origin group."
}

variable "backend_host_name" {
  type        = string
  description = "The hostname of the backend server (App Service)."
}

variable "backend_origins" {
  type        = set(string)
  description = "A set of backend origin identifiers (used with `for_each`)."
}

variable "patterns_to_match" {
  type        = list(string)
  description = "List of URL path patterns to match in the route."
}

variable "server_app_port" {
  type        = number
  description = "The HTTP port for the backend server app."
}
