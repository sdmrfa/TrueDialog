import { HttpRequest, InvocationContext } from "@azure/functions";
import { logEvent } from "../utils/logger";

/**
 * Handles a HubSpot webhook event by logging a simple message.
 *
 * Parameters:
 *   - req: The HTTP request containing the webhook payload.
 *   - context: Provides runtime information about the function execution.
 *
 * Returns:
 *   Object with event type and data.
 */
export const handleHubSpotEvent = async (req: HttpRequest, context: InvocationContext) => {
    logEvent(context, "info", "hello from hubspot handler");
    return { event: "message", data: "Logged from HubSpot handler" };
};