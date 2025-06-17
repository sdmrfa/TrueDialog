# File: Infrastructure/modules/backend_app_service/variables.tf

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "backend_app_name" {
  description = "Name of the Web App"
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

variable "app_service_plan_sku" {
  description = "SKU for the App Service Plan (e.g., B1, F1)"
  type        = string
  default     = "B1" 
}

variable "node_version_asp" {
  description = "Node.js version for the Web App"
  type        = string
  default     = "20-lts"
}

variable "backend_app_port" {
  description = "Port the application listens on"
  type        = string
  default     = "8080"
}

variable "always_on" {
  description = "Whether the app should be always on"
  type        = bool
  default     = true
}