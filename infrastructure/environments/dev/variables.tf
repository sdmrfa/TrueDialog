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

variable "cosmos_db_account_name" {
  description = "Name of the Cosmos DB account"
  type        = string
  default     = "tdcdb"
}

variable "cosmos_db_database_name" {
  description = "Name of the Cosmos DB database"
  type        = string
  default     = "tddb"
}

variable "cosmos_db_container_name" {
  description = "Name of the Cosmos DB container"
  type        = string
  default     = "tdcnt"
}

variable "cosmos_db_partition_key_path" {
  description = "Partition key path for the Cosmos DB container"
  type        = string
  default     = "/id"
}

variable "cosmos_db_throughput" {
  description = "Throughput for the Cosmos DB database"
  type        = number
  default     = 1000
}

variable "cosmos_db_max_throughput" {
  description = "Maximum throughput for the Cosmos DB container autoscale"
  type        = number
  default     = 5000
}

variable "cosmos_db_offer_type" {
  description = "Offer type for Cosmos DB"
  type        = string
  default     = "Standard"
}

variable "cosmos_db_kind" {
  description = "Kind of Cosmos DB account"
  type        = string
  default     = "GlobalDocumentDB"
}

variable "apim_name" {
  description = "Name of the API Management instance"
  type        = string
  default     = "tdapim"
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

variable "app_service_plan_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "P1v3"
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
  default     = 2
}

variable "app_service_max_instance_count" {
  type        = number
  description = "Maximum number of instances for autoscale"
  default     = 5
}


variable "front_door_name" {
  description = "Name of the Azure Front Door instance"
  type        = string
  default     = "tdfd"
}

variable "app_gateway_name" {
  description = "Name of the Azure Application Gateway"
  type        = string
  default     = "tdagw"
}

variable "app_gateway_sku" {
  description = "SKU for the Application Gateway"
  type        = string
  default     = "WAF_v2"
}

variable "app_gateway_capacity" {
  description = "Initial capacity for Application Gateway"
  type        = number
  default     = 1
}