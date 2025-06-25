# File: Infrastructure/modules/server_app_service/variables.tf

# Server App Service
variable "rg_name" {
  description = "Name of the Resource Group"
  type        = string
}

variable "swa_name" {
  description = "Name of the Service Web App"
  type        = string
}

variable "swa_asp_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "swa_asp_sku" {
  description = "SKU for the App Service Plan"
  type        = string
}

variable "swa_asp_location" {
  description = "Azure region for resources"
  type        = string
}

variable "swa_node_version" {
  description = "Node.js version for the Web App"
  type        = string
}

variable "swa_port" {
  description = "Port the application listens on"
  type        = string
}

variable "swa_instance_count" {
  description = "Initial number of App Service instances"
  type        = number
}

variable "swa_max_instance_count" {
  type        = number
  description = "Maximum number of App Service instances"
}

variable "swa_health_check_path" {
  description = "Health check path for App Service"
  type        = string
}

variable "swa_always_on" {
  description = "Whether the app should be always on"
  type        = bool
}

