# File: Infrastructure/modules/apim/variables.tf

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "apim_name" {
  description = "Name of the API Management instance"
  type        = string
}

variable "publisher_name" {
  description = "Name of the publisher"
  type        = string
}

variable "publisher_email" {
  description = "Email address of the publisher"
  type        = string
}

variable "apim_sku" {
  description = "SKU name for API Management"
  type        = string
}

variable "backend_app_service" {
  description = "URL of the backend App Service"
  type        = string
}