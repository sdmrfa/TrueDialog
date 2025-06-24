# File: Infrastructure/modules/app_gateway/variables.tf

variable "resource_group_name" {
  type        = string
  description = "Resource group for the Front Door resources"
}

variable "front_door_name" {
  type        = string
  description = "Name prefix for Azure Front Door resources"
}

variable "backend_app_services" {
  type        = set(string)
  description = "Set of backend app service hostnames (e.g. https://myapp.azurewebsites.net)"
}
