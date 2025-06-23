# File: Infrastructure/environment/Prod/variables.tf

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "Truedialog-rg-test"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Australia Central"
}

variable "apim_name" {
  description = "Name of the API Management instance"
  type        = string
  default     = "Truedialog-apim-test"
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