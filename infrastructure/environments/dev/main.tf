# File: Infrastructure/environment/Dev/main.tf

provider "azurerm" {
  features {}
}

module "resource_group" {
  source              = "../../modules/resource_group"
  resource_group_name = var.resource_group_name
  location            = var.location
}

module "app_service" {
  source               = "../../modules/app_service"
  app_service_plan_name = "${var.resource_group_name}asp"
  app_name             = "${var.resource_group_name}app"
  resource_group_name  = module.resource_group.resource_group_name
  location            = var.location
  app_service_plan_sku = var.app_service_plan_sku
  node_version_asp         = var.node_version_asp
  app_port             = var.app_port
}

module "function_app" {
  source               = "../../modules/function_app"
  function_app_name    = "${var.resource_group_name}fn"
  resource_group_name  = module.resource_group.resource_group_name
  location            = var.location_fn
  function_sku         = var.function_sku
  node_version_fn         = var.node_version_fn
}

module "apim" {
  source              = "../../modules/apim"
  apim_name           = var.apim_name
  resource_group_name = module.resource_group.resource_group_name
  location            = var.location
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  apim_sku            = var.apim_sku
  backend_url         = module.app_service.webapp_url
  webhook_backend_url = module.function_app.function_app_url
}