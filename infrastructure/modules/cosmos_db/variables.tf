# File: Infrastructure/modules/cosmos_db/variables.tf

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "cosmos_db_account_name" {
  description = "Name of the Cosmos DB account"
  type        = string
}

variable "cosmos_db_database_name" {
  description = "Name of the Cosmos DB database"
  type        = string
}

variable "cosmos_db_container_name" {
  description = "Name of the Cosmos DB container"
  type        = string
}

variable "cosmos_db_partition_key_path" {
  description = "Partition key path for the Cosmos DB container"
  type        = string
}

variable "cosmos_db_throughput" {
  description = "Throughput for the Cosmos DB database"
  type        = number
}

variable "cosmos_db_max_throughput" {
  description = "Maximum throughput for the Cosmos DB container autoscale"
  type        = number
}

variable "cosmos_db_offer_type" {
  description = "Offer type for Cosmos DB"
  type        = string
}

variable "cosmos_db_kind" {
  description = "Kind of Cosmos DB account"
  type        = string
}