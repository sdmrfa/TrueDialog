# File: Infrastructure/environment/Dev/main.tf

provider "azurerm" {
  subscription_id = "e39de7c6-22af-4395-94d1-0c8f4a74df03"
  features {}
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.34.0"
    }
  }
  required_version = ">= 1.12.2"
}

module "resource_group" {
  source      = "../../modules/resource_group"
  rg_name     = var.rg_name
  rg_location = var.rg_location
}

module "server_web_app_service" {
  source                 = "../../modules/app_service/server_web_app_service"
  swa_asp_name           = "${var.rg_name}swa-asp"
  swa_asp_sku            = var.swa_asp_sku
  swa_asp_location       = var.swa_asp_location
  swa_name               = "${var.rg_name}swa"
  rg_name                = module.resource_group.rg_name
  swa_node_version       = var.swa_node_version
  swa_port               = var.swa_port
  swa_instance_count     = var.swa_instance_count
  swa_max_instance_count = var.swa_max_instance_count
  swa_health_check_path  = var.swa_health_check_path
  swa_always_on          = var.swa_always_on
}

module "opt_out_hs_webhook" {
  source                     = "../../modules/functions/webhooks/opt-out-hs"
  rg_name                    = module.resource_group.rg_name
  ohs_astg_location          = var.ohs_astg_location
  ohs_astg_tier              = var.ohs_astg_tier
  ohs_asp_name               = "${var.rg_name}ohs-asp"
  ohs_asp_location           = var.ohs_asp_location
  ohs_asp_sku                = var.ohs_asp_sku
  ohs_name                   = "${var.rg_name}ohs"
  ohs_runtime_name           = var.ohs_runtime_name
  ohs_node_version           = var.ohs_node_version
  ohs_maximum_instance_count = var.ohs_maximum_instance_count
  ohs_instance_memory_in_mb  = var.ohs_instance_memory_in_mb
}
