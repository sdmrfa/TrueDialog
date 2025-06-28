# File: Infrastructure/modules/functions/webhooks/opt-out-td

variable "rg_name" {
  description = "Name of the resource group"
  type        = string
}

variable "otd_astg_location" {
  description = "Azure region for the storage account"
  type        = string
}

variable "otd_astg_tier" {
  description = "Tier of the storage account (e.g., Standard)"
  type        = string
}

variable "otd_asp_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "otd_asp_location" {
  description = "Azure region for the App Service Plan"
  type        = string
}

variable "otd_asp_sku" {
  description = "SKU of the App Service Plan (e.g., Y1, EP1)"
  type        = string
}

variable "otd_name" {
  description = "Name of the Opt-Out HS Function App"
  type        = string
}

variable "otd_runtime_name" {
  description = "Name of the runtime for the opt-out hubspot webhook"
  type        = string
}

variable "otd_node_version" {
  description = "Node.js version for the opt-out hubspot webhook"
  type        = string
}

variable "otd_maximum_instance_count" {
  description = "Maximum number of instances for the opt-out hubspot webhook"
  type        = number
}

variable "otd_instance_memory_in_mb" {
  description = "Memory allocated per instance for the opt-out hubspot webhook"
  type        = number
}
