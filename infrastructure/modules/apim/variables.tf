# File: Infrastructure/modules/apim/variables.tf

variable "apim_name" {
  description = "Name of the API Management instance"
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

variable "publisher_name" {
  description = "Name of the publisher"
  type        = string
}

variable "publisher_email" {
  description = "Email address of the publisher"
  type        = string
}

variable "apim_sku" {
  description = "SKU name for API Management (e.g., Developer_1)"
  type        = string
}

variable "backend_url" {
  description = "Backend URL for the APIs (e.g., App Service URL)"
  type        = string
}

variable "webhook_backend_url" {
  description = "Backend URL for the webhook API (e.g., Function App URL)"
  type        = string
}