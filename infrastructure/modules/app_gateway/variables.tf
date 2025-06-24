# File: Infrastructure/modules/app_gateway/variables.tf

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "app_gateway_name" {
  description = "Name of the Application Gateway"
  type        = string
}

variable "app_gateway_sku" {
  description = "SKU for the Application Gateway"
  type        = string
}

variable "app_gateway_capacity" {
  description = "Initial capacity for Application Gateway"
  type        = number
}

variable "backend_app_services" {
  description = "List of backend App Service FQDNs"
  type        = list(string)
}