import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleHubSpotEvent } from "../handlers/handler.hubspot"
import { handleTrueDialogEvent } from "../handlers/handler.truedialog"
import { logEvent } from "../utils/logger";

// Event handler mappings
const eventHandlers: { [key: string]: (req: HttpRequest, context: InvocationContext) => Promise<{ event: string; data: any }> } = {
    "hubspot": handleHubSpotEvent,
    "truedialog": handleTrueDialogEvent
};

/**
 * Main function invoked by Azure Functions for webhook events.
 *
 * Parameters:
 *   - request: The HTTP request containing the webhook event.
 *   - context: Provides runtime information about the function execution.
 *
 * Returns:
 *   Response object for the HTTP trigger.
 */
export async function WebhookHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const source = request.params.source?.toLowerCase() || "unknown";
    
    logEvent(context, "info", `Processing webhook for source: ${source}`);

    const handler = eventHandlers[source];
    if (!handler) {
        logEvent(context, "error", `Unsupported webhook source: ${source}`);
        return { status: 400, body: "Unsupported webhook source" };
    }

    const result = await handler(request, context);
    logEvent(context, "info", source, result.event, result.data);
};

// Register the HTTP trigger
app.http('WebhookHandler', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'webhook/{source}',
    handler: WebhookHandler
});