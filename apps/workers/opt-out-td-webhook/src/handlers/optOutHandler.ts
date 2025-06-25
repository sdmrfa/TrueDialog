import { HttpRequest, InvocationContext } from "@azure/functions";

// Interface for webhook response
interface WebhookResponse {
  message: string;
  data: any;
}

/**
 * Handles TrueDialog opt-out event
 * @param req - HTTP request containing webhook payload
 * @param context - Invocation context for logging
 * @returns Processed webhook response
 * @throws Error if JSON parsing fails
 */
export async function handleOptOutEvent(
  req: HttpRequest,
  context: InvocationContext
): Promise<WebhookResponse> {
  try {
    const body = await req.json();
    context.log(`Received TrueDialog payload: ${JSON.stringify(body, null, 2)}`);

    return {
      message: "TrueDialog opt-out event received",
      data: body,
    };
  } catch (error) {
    context.error("Failed to process webhook payload:", error);
    throw new Error("Invalid payload format");
  }
}