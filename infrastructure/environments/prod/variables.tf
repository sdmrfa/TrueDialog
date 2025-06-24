# File: Infrastructure/environment/Dev/variables.tf

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "tdrg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Australia Central"
}

variable "app_service_plan_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "P1V3"
}

variable "node_version_asp" {
  description = "Node.js version for the Web App"
  type        = string
  default     = "20-lts"
}

variable "server_app_port" {
  description = "Port the application listens on"
  type        = string
  default     = "8080"
}

variable "app_service_instance_count" {
  description = "Initial number of App Service instances"
  type        = number
  default     = 3
}

variable "app_service_max_instance_count" {
  type        = number
  description = "Maximum number of instances for autoscale"
  default     = 3
}

variable "health_check_path" {
  description = "Path for the health check"
  type        = string
  default     = "/health"
}

variable "always_on" {
  description = "Whether the app should be always on"
  type        = bool
  default     = true
}
