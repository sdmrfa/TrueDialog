# File: Infrastructure/modules/function_app/variables.tf

variable "function_app_name" {
  description = "Name of the Function App"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "function_sku" {
  description = "SKU for the Function App Service Plan (e.g., Y1 for Consumption)"
  type        = string
  default     = "Y1"
}

variable "node_version_fn" {
  description = "Node.js version for the Function App"
  type        = string
  default     = "20"
}