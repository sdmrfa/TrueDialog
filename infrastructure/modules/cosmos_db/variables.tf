# File: Infrastructure/modules/cosmos_db/variables.tf

variable "account_name" {
  description = "Name of the Cosmos DB account"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for Cosmos DB"
  type        = string
}

variable "offer_type" {
  description = "Offer type for Cosmos DB"
  type        = string
  default     = "Standard"
}

variable "kind" {
  description = "Kind of Cosmos DB account"
  type        = string
  default     = "GlobalDocumentDB"
}

variable "enable_automatic" {
  description = "Enable automatic failover"
  type        = bool
  default     = true
}

variable "throughput" {
  description = "Throughput for the database"
  type        = number
  default     = 400
}

variable "database_name" {
  description = "Name of the Cosmos DB database"
  type        = string
}

variable "container_name" {
  description = "Name of the Cosmos DB container"
  type        = string
}

variable "partition_key_path" {
  description = "Partition key path for the container"
  type        = string
}

variable "max_throughput" {
  description = "Maximum throughput for the container autoscale"
  type        = number
  default     = 4000
}