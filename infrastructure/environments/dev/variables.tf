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

variable "location_cosmos_db" {
  description = "Azure region for Cosmos DB"
  type        = string
  default     = "West US 3"
}

variable "cosmos_db_account_name" {
  description = "Name of the Cosmos DB account"
  type        = string
  default     = "tdtcdb"
}

variable "cosmos_db_database_name" {
  description = "Name of the Cosmos DB database"
  type        = string
  default     = "tdtdb"
}

variable "cosmos_db_container_name" {
  description = "Name of the Cosmos DB container"
  type        = string
  default     = "tdtcnt"
}

variable "cosmos_db_partition_key_path" {
  description = "Partition key path for the Cosmos DB container"
  type        = string
  default     = "/id"
}

variable "cosmos_db_throughput" {
  description = "Throughput for the Cosmos DB database"
  type        = number
  default     = 400
}

variable "cosmos_db_max_throughput" {
  description = "Maximum throughput for the Cosmos DB container autoscale"
  type        = number
  default     = 4000
}

variable "cosmos_db_offer_type" {
  description = "Offer type for Cosmos DB (usually Standard)"
  type        = string
  default     = "Standard"
}

variable "cosmos_db_kind" {
  description = "Kind of Cosmos DB account (e.g., GlobalDocumentDB)"
  type        = string
  default     = "GlobalDocumentDB"
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

variable "backend_app_port" {
  description = "Port the application listens on"
  type        = string
  default     = "8080"
}


variable "frontend_app_port" {
  description = "Port the application listens on"
  type        = string
  default     = "5173"
}

variable "function_sku" {
  description = "SKU for the Function App Service Plan (e.g., Y1 for Consumption)"
  type        = string
  default     = "Y1"
}

variable "static_web_app_name" {
  description = "Name of the Static Web App"
  type        = string
  default     = "tdtswa"
}


variable "swa_app_location" {
  description = "Path to the React app source code in the repository"
  type        = string
  default     = "/"
}

variable "swa_output_location" {
  description = "Path to the React app build output directory"
  type        = string
  default     = "build"
}

variable "swa_app_build_command" {
  description = "Custom build command for the React app"
  type        = string
  default     = "npm install && npm run build"
}