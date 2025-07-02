import { app, InvocationContext } from "@azure/functions";
import axios from "axios";
import createTrueDialogClient from "../services/trueDialogInstance";

interface SmsQueuePayload {
  trueDialog: {
    apiKey: string;
    apiSecret: string;
    accountId: string;
  };
  smsPayload: {
    Channels: string[];
    Targets: string[];
    Message: string;
    Execute: boolean;
  };
}

export async function processSmsQueueMessage( message: any, context: InvocationContext ): Promise<void> {
  try {
    const data = await message;
    // const parsedMessage = typeof message === "string" ? JSON.parse( message ) : message;

    console.log( "DATAAAAAAAAaa=>", data )
    const { trueDialog, smsPayload } = data;
    const { apiKey, apiSecret, accountId } = trueDialog;
    const trueDialogAxiosInstance = createTrueDialogClient( { trueDialogApiKey: apiKey, trueDialogApiSecret: apiSecret } );
    console.log( "trueDialogAxiosInstance===>", trueDialogAxiosInstance )
    context.log( `📤 Sending SMS: ${ JSON.stringify( smsPayload ) }` );
    const response = await trueDialogAxiosInstance.post( `/account/${ accountId }/action-pushcampaign`, smsPayload );
    context.log( `✅ SMS sent successfully: ${ JSON.stringify( response.data ) }` );

  } catch ( err: any ) {
    // context.error( "❌ Error processing Service Bus message:", err );
    throw err; // let Azure retry
  }
}


// Register the function
app.serviceBusQueue( "processSmsQueueMessage", {
  queueName: "one_to_one",
  connection: "SERVICE_BUS_CONNECTION_STRING",
  handler: processSmsQueueMessage,
} );
