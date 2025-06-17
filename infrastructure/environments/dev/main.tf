# File: Infrastructure/environment/Dev/main.tf

provider "azurerm" {
  features {}
}

module "resource_group" {
  source              = "../../modules/resource_group"
  resource_group_name = var.resource_group_name
  location            = var.location
}

module "backend_app_service" {
  source                = "../../modules/backend_app_service"
  app_service_plan_name = "${var.resource_group_name}asp"
  backend_app_name      = "${var.resource_group_name}bwa"
  resource_group_name   = module.resource_group.resource_group_name
  location              = var.location
  app_service_plan_sku  = var.app_service_plan_sku
  node_version_asp      = var.node_version_asp
  backend_app_port      = var.backend_app_port
}

module "frontend_app_service" {
  source                = "../../modules/frontend_app_service"
  app_service_plan_name = "${var.resource_group_name}asp"
  frontend_app_name     = "${var.resource_group_name}fwa"
  resource_group_name   = module.resource_group.resource_group_name
  location              = var.location
  app_service_plan_sku  = var.app_service_plan_sku
  node_version_asp      = var.node_version_asp
  frontend_app_port     = var.frontend_app_port
}

module "webhook_function_app" {
  source               = "../../modules/webhook_function_app"
  webhook_function_app_name    = "${var.resource_group_name}fn"
  resource_group_name  = module.resource_group.resource_group_name
  location             = var.location_fn
  function_sku         = var.function_sku
  node_version_fn      = var.node_version_fn
}

module "cosmos_db" {
  source              = "../../modules/cosmos_db"
  account_name        = var.cosmos_db_account_name
  resource_group_name = module.resource_group.resource_group_name
  location            = var.location_cosmos_db
  offer_type          = var.cosmos_db_offer_type
  kind                = var.cosmos_db_kind
  throughput          = var.cosmos_db_throughput
  database_name       = var.cosmos_db_database_name
  container_name      = var.cosmos_db_container_name
  partition_key_path  = var.cosmos_db_partition_key_path
  max_throughput      = var.cosmos_db_max_throughput
}

module "apim" {
  source              = "../../modules/apim"
  apim_name           = var.apim_name
  resource_group_name = module.resource_group.resource_group_name
  location            = var.location
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  apim_sku            = var.apim_sku
  backend_url         = module.backend_app_service.backend_web_app_url
  frontend_url        = module.frontend_app_service.frontend_web_app_url
  webhook_url         = module.webhook_function_app.webhook_function_app_url
}