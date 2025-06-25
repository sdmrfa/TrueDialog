# File: Infrastructure/modules/functions/webhooks/opt-out-hs

output "opt_out_hs_webhook_url" {
  description = "Default hostname of the Flex Consumption Function App"
  value       = "https://${azurerm_function_app_flex_consumption.opt_out_hs_webhook.default_hostname}"
}

output "opt_out_hs_webhook_name" {
  description = "Name of the Function App"
  value       = azurerm_function_app_flex_consumption.opt_out_hs_webhook.name
}

