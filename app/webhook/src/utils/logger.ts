import { InvocationContext } from "@azure/functions";

/**
 * Logs an event with a timestamp.
 *
 * Parameters:
 *   - context: Azure Functions context for logging.
 *   - level: Log level (e.g., "info", "error").
 *   - message: Message to log.
 *   - event (optional): Event type.
 *   - data (optional): Event data.
 */
export const logEvent = (context: InvocationContext, level: string, message: string, event?: string, data?: any) => {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (event && data) {
        logMessage += ` - ${event}: ${JSON.stringify(data)}`;
    }
    context.log(logMessage);
};