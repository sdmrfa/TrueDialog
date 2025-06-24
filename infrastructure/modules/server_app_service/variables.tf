# File: Infrastructure/modules/server_app_service/variables.tf

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "server_app_name" {
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
  description = "SKU for the App Service Plan"
  type        = string
}

variable "node_version_asp" {
  description = "Node.js version for the Web App"
  type        = string
}

variable "server_app_port" {
  description = "Port the application listens on"
  type        = string
}

variable "health_check_path" {
  description = "Path for the health check"
  type        = string
}

variable "always_on" {
  description = "Whether the app should be always on"
  type        = bool
}

variable "instance_count" {
  description = "Initial number of App Service instances"
  type        = number
}

variable "maximum_count" {
  type        = number
  description = "Maximum number of instances for autoscale"
}