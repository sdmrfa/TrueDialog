# File: Infrastructure/modules/functions/webhooks/opt-out-hs

variable "rg_name" {
  description = "Name of the resource group"
  type        = string
}

variable "ohs_astg_location" {
  description = "Azure region for the storage account"
  type        = string
}

variable "ohs_astg_tier" {
  description = "Tier of the storage account (e.g., Standard)"
  type        = string
}

variable "ohs_asp_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "ohs_asp_location" {
  description = "Azure region for the App Service Plan"
  type        = string
}

variable "ohs_asp_sku" {
  description = "SKU of the App Service Plan (e.g., Y1, EP1)"
  type        = string
}

variable "ohs_name" {
  description = "Name of the Opt-Out HS Function App"
  type        = string
}

variable "ohs_runtime_name" {
  description = "Name of the runtime for the opt-out hubspot webhook"
  type        = string
}

variable "ohs_node_version" {
  description = "Node.js version for the opt-out hubspot webhook"
  type        = string
}

variable "ohs_maximum_instance_count" {
  description = "Maximum number of instances for the opt-out hubspot webhook"
  type        = number
}

variable "ohs_instance_memory_in_mb" {
  description = "Memory allocated per instance for the opt-out hubspot webhook"
  type        = number
}
