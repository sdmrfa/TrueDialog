# File: Infrastructure/environment/Dev/main.tf

provider "azurerm" {
  features {}
}

module "resource_group" {
  source              = "../../modules/resource_group"
  resource_group_name = var.resource_group_name
  location            = var.location
}

module "server_app_service" {
  source                = "../../modules/server_app_service"
  app_service_plan_name = "${var.resource_group_name}asp"
  server_app_name      = "${var.resource_group_name}swa"
  resource_group_name   = module.resource_group.resource_group_name
  location              = var.location
  app_service_plan_sku  = var.app_service_plan_sku
  node_version_asp      = var.node_version_asp
  server_app_port       = var.server_app_port
}
