# File: Infrastructure/modules/functions/webhooks/opt-out-td

output "opt_out_td_webhook_url" {
  description = "Default hostname of the Flex Consumption Function App"
  value       = azurerm_function_app_flex_consumption.opt_out_td_webhook.default_hostname
}

output "opt_out_td_webhook_name" {
  description = "Name of the Function App"
  value       = azurerm_function_app_flex_consumption.opt_out_td_webhook.name
}

