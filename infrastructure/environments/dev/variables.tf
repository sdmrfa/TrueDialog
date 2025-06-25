# File: Infrastructure/environment/Dev/variables.tf

# Resource Group
variable "rg_name" {
  description = "Name of the resource group"
  type        = string
  default     = "tdrg"
}

variable "rg_location" {
  description = "Azure region for resources"
  type        = string
  default     = "Australia Central"
}

# Server App Service
variable "swa_asp_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
}

variable "swa_asp_location" {
  description = "Azure region for resources"
  type        = string
  default     = "Australia Central"
}

variable "swa_node_version" {
  description = "Node.js version for the Web App"
  type        = string
  default     = "20-lts"
}

variable "swa_port" {
  description = "Port the application listens on"
  type        = string
  default     = "8080"
}

variable "swa_instance_count" {
  description = "Initial number of App Service instances"
  type        = number
  default     = 2
}

variable "swa_max_instance_count" {
  type        = number
  description = "Maximum number of App Service instances"
  default     = 2
}

variable "swa_health_check_path" {
  description = "Health check path for App Service"
  type        = string
  default     = "/health"
}

variable "swa_always_on" {
  description = "Whether the app should be always on"
  type        = bool
  default     = true
}

# Opt-out Health Service Webhook
variable "ohs_asp_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "FC1"
}

variable "ohs_asp_location" {
  description = "Azure region for resources"
  type        = string
  default     = "Canada Central"
}
variable "ohs_astg_location" {
  description = "Azure region for the Application Service"
  type        = string
  default     = "Canada Central"
}

variable "ohs_astg_tier" {
  description = "Tier for the Application Service"
  type        = string
  default     = "Standard"
}

variable "ohs_runtime_name" {
  description = "Name of the runtime for the opt-out hubspot webhook"
  type        = string
  default     = "node"
}

variable "ohs_node_version" {
  description = "Node.js version for the opt-out hubspot webhook"
  type        = string
  default     = "20"
}

variable "ohs_maximum_instance_count" {
  description = "Maximum number of instances for the opt-out hubspot webhook"
  type        = number
  default     = 50
}

variable "ohs_instance_memory_in_mb" {
  description = "Memory allocated per instance for the opt-out hubspot webhook"
  type        = number
  default     = 2048
}