# File: Infrastructure/environment/Prod/main.tf

provider "azurerm" {
  features {}
}

module "resource_group" {
  source              = "../../modules/resource_group"
  resource_group_name = var.resource_group_name
  location            = var.location
}

module "apim" {
  source              = "../../modules/apim"
  apim_name           = var.apim_name
  resource_group_name = module.resource_group.resource_group_name
  location            = var.location
  publisher_name      = var.publisher_name
  publisher_email     = var.publisher_email
  apim_sku            = var.apim_sku
}