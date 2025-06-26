import { Container, CosmosClient } from '@azure/cosmos';
import { HubspotTrueDialogAccountInfo } from '../../types/hubspot-true-dialog-association-info'
import { tokenContainer, associateContainer, conversationContainer } from './cosmosInit';
import { ChatMessage, MessageDoc } from '../../types/one-to-one-sms';


// const cosmosClient = new CosmosClient( {
//   endpoint: process.env.COSMOS_DB_ENDPOINT!,
//   key: process.env.COSMOS_DB_KEY!,
// } );
// const database = cosmosClient.database( process.env.COSMOS_DB_DATABASE! );
// const container = database.container( process.env.COSMOS_DB_CONTAINER! );


interface TokenDoc {
  id: string; // same as portalId
  portalId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
}

interface AssociateInfoDocument {
  id: string;
  userEmail: string;
  portalId: string;
  clientHubspotTrueDialogAccountInfo: {
    refreshToken: string;
    trueDialogAccountId: string;
    trueDialogApiKey: string;
    trueDialogApiSecret: string;
  };
  createdAt: string;
}

export default class CosmosService {
  constructor(
    private tokenContainer: Container,
    private associateContainer: Container
  ) { }

  static async saveHubSpotToken( portalId: string, accessToken: string, refreshToken: string ) {
    const tokenDoc: TokenDoc = {
      id: portalId,
      portalId,
      accessToken,
      refreshToken,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await tokenContainer.items.upsert( tokenDoc );
    console.log( `✅ Tokens saved for portalId ${ portalId }` );
    return resource;
  }

  // ✅ Retrieve tokens by portalId
  static async getTokensByPortalId( portalId: string ) {
    try {
      const { resource } = await tokenContainer.item( portalId, portalId ).read<any>();
      if ( !resource ) {
        throw new Error( `No token found for portalId ${ portalId }` );
      }

      return {
        accessToken: resource.accessToken,
        refreshToken: resource.refreshToken,
        createdAt: resource.createdAt,
      };
    } catch ( error: any ) {
      console.error( `❌ Error fetching token for ${ portalId }:`, error.message );
      return null;
    }
  }


  // ✅ Save client info using `userEmail-portalId` as id
  static async saveAssociateInfo(
    userEmail: string,
    portalId: string,
    clientHubspotTrueDialogAccountInfo: any
  ) {
    const id = `${ userEmail }-${ portalId }`;

    const doc: AssociateInfoDocument = {
      id,
      userEmail,
      portalId,
      clientHubspotTrueDialogAccountInfo,
      createdAt: new Date().toISOString(),
    };

    try {
      const { resource } = await associateContainer.items.upsert( doc );
      console.log( `✅ Client info saved for ${ id }` );
      return resource;
    } catch ( err: any ) {
      console.error( `❌ Error saving client info for ${ id }:`, err.message );
      throw err;
    }
  }

  static async getRefreshTokenByPortalId( portalId: string ): Promise<string | null> {
    const query = {
      query: 'SELECT c.refreshToken FROM c WHERE c.portalId = @portalId',
      parameters: [{ name: '@portalId', value: portalId }]
    };
    const { resources } = await tokenContainer.items.query( query ).fetchAll();
    if ( resources.length > 0 && resources[0].refreshToken ) {
      return resources[0].refreshToken;
    }

    return null;
  };

  static async getClientHubspotTrueDialogAccountInfoById(
    id: string
  ): Promise<HubspotTrueDialogAccountInfo | null> {
    const query = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: id }]
    };

    const { resources } = await associateContainer.items.query( query ).fetchAll();

    if ( resources.length > 0 ) {
      return resources[0] as HubspotTrueDialogAccountInfo;
    }

    return null;
  }

  static async getAllHubSpotAccountsByAccountId( accountId: number ): Promise<HubspotTrueDialogAccountInfo[]> {
    console.log( "acc key==>", accountId )

    const query = {
      query: "SELECT * FROM c WHERE c.clientHubspotTrueDialogAccountInfo.trueDialogAccountId = @accountId",
      parameters: [{ name: "@accountId", value: String( accountId ) }]
    };
    const { resources } = await associateContainer.items.query( query ).fetchAll();
    return resources || [];
  }

  //Conversation
  static async saveMessage(
    portalId: string,
    channelId: string,
    contactPhone: string,
    contactId: string,
    message: ChatMessage
  ) {
    const id = `${ portalId }-${ contactId }`;
    const now = new Date().toISOString();

    const { resource: existingDoc } = await conversationContainer.item( id, id ).read<MessageDoc>();
    const updatedDoc: MessageDoc = {
      id,
      sending: existingDoc?.sending ? [...existingDoc.sending, message] : [message],
      failed: existingDoc?.failed || [],
      createdAt: existingDoc?.createdAt || now,
      updatedAt: now,
      ...( existingDoc ? {} : { firstMessage: message } ),
    };

    const { resource } = await conversationContainer.items.upsert( updatedDoc );
    if ( !resource ) {
      throw new Error( `Conversation record not saved for id: ${ id }` );
    }
    console.log( `Conversation saved for id ${ id }` );
    console.log( "resource=======>", resource );
  }


}