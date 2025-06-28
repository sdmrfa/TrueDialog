# File: Infrastructure/environment/Dev/outputs.tf

output "rg_name" {
  description = "Name of the resource group"
  value       = module.resource_group.rg_name
}

output "swa_url" {
  description = "Url of the server Web App"
  value       = module.server_web_app_service.swa_url
}

output "ohs_webhook_url" {
  description = "Url of the opt out webhook for HubSpot"
  value       = module.opt_out_hs_webhook.opt_out_hs_webhook_url
}

output "otd_webhook_url" {
  description = "Url of the opt out webhook for TrueDialog"
  value       = module.opt_out_td_webhook.opt_out_td_webhook_url
}