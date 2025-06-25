import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleOptOutEvent } from "../handlers/optOutHandler";

interface WebhookResponse {
  message: string;
  data?: any;
}

/**
 * Azure Function to handle opt-out webhook requests
 * @param request - HTTP request object
 * @param context - Invocation context for logging
 * @returns HTTP response
 */
export async function optOutWebhook(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  if (request.method === "GET") {
    return {
      status: 200,
      body: "Hubspot Opt-out webhook is alive",
    };
  }

  try {
    if (request.method !== "POST") {
      return {
        status: 405,
        body: "Method Not Allowed",
        headers: { "Allow": "GET, POST" },
      };
    }

    const result = await handleOptOutEvent(request, context);
    return {
      status: 200,
      body: JSON.stringify(result),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    context.error("Webhook processing failed:", error);
    return {
      status: 500,
      body: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
    };
  }
}

app.http("OptOutWebhook", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "webhook/opt-out-td",
  handler: optOutWebhook,
});