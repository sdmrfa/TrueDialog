import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { processSmsQueueMessage } from "../handlers/one-to-one";

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
export async function oneToOneWorker(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  if ( request.method === "GET" ) {
    return {
      status: 200,
      body: "TrueDialog One to One Service",
    };
  }

  try {
    if ( request.method !== "POST" ) {
      return {
        status: 405,
        body: "Method Not Allowed",
        headers: { "Allow": "GET, POST" },
      };
    }

    const result = await processSmsQueueMessage( request, context );
    return {
      status: 200,
      body: JSON.stringify( result ),
      headers: { "Content-Type": "application/json" },
    };
  } catch ( error: any ) {
    context.error( "Webhook processing failed:", error.response.data );
    return {
      status: 500,
      body: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
    };
  }
}

app.http( "oneToOneWorker", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "one-to-one",
  handler: oneToOneWorker,
} );