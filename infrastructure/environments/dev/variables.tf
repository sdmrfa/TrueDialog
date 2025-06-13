# File: Infrastructure/environment/Dev/variables.tf

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "tdtrg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Australia Central"
}

variable "location_fn" {
  description = "Azure region for function"
  type        = string
  default     = "Canada Central"  
}

variable "apim_name" {
  description = "Name of the API Management instance"
  type        = string
  default     = "tdtapim"
}

variable "publisher_name" {
  description = "Name of the publisher"
  type        = string
  default     = "Growtomation"
}

variable "publisher_email" {
  description = "Email address of the publisher"
  type        = string
  default     = "maruf@growtomation.in"
}

variable "apim_sku" {
  description = "SKU name for API Management"
  type        = string
  default     = "Developer_1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "app_service_plan_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
}

variable "node_version_asp" {
  description = "Node.js version for the Web App"
  type        = string
  default     = "20-lts"
}

variable "node_version_fn" {
  description = "Node.js version for the Function"
  type        = string
  default     = "20"
}

variable "app_port" {
  description = "Port the application listens on"
  type        = string
  default     = "8080"
}

variable "function_sku" {
  description = "SKU for the Function App Service Plan (e.g., Y1 for Consumption)"
  type        = string
  default     = "Y1"
}