# File: Infrastructure/modules/resource_group/variables.tf

variable "rg_name" {
  description = "Name of the resource group"
  type        = string
}

variable "rg_location" {
  description = "Azure region for resources"
  type        = string
}