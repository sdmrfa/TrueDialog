import { CosmosClient } from '@azure/cosmos';

const cosmosClient = new CosmosClient( {
  endpoint: process.env.COSMOS_DB_ENDPOINT!,
  key: process.env.COSMOS_DB_KEY!,
} );

const database = cosmosClient.database( process.env.COSMOS_DB_DATABASE! );
const container = database.container( process.env.COSMOS_DB_CONTAINER! );

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

export async function saveHubSpotToken( portalId: string, accessToken: string, refreshToken: string ) {
  const tokenDoc: TokenDoc = {
    id: portalId,
    portalId,
    accessToken,
    refreshToken,
    createdAt: new Date().toISOString(),
  };

  const { resource } = await container.items.upsert( tokenDoc );
  console.log( `✅ Tokens saved for portalId ${ portalId }` );
  return resource;
}

// ✅ Retrieve tokens by portalId
export async function getTokensByPortalId( portalId: string ) {
  try {
    const { resource } = await container.item( portalId, portalId ).read<any>();
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
export async function saveAssociateInfo(
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
    const { resource } = await container.items.upsert( doc );
    console.log( `✅ Client info saved for ${ id }` );
    return resource;
  } catch ( err: any ) {
    console.error( `❌ Error saving client info for ${ id }:`, err.message );
    throw err;
  }
}

// ✅ Retrieve client info using userEmail + portalId
export async function getClientInfo( userEmail: string, portalId: string ) {
  const id = `${ userEmail }-${ portalId }`;

  try {
    const { resource } = await container.item( id, id ).read<any>();
    return resource;
  } catch ( err: any ) {
    console.error( `❌ Client info not found for ${ id }` );
    return null;
  }
}

export async function getRefreshTokenByPortalId( portalId: string ): Promise<string | null> {
  const query = {
    query: 'SELECT c.tokens.refreshToken FROM c WHERE c.portalId = @portalId',
    parameters: [{ name: '@portalId', value: portalId }]
  };

  const { resources } = await container.items.query( query ).fetchAll();

  if ( resources.length > 0 && resources[0].refreshToken ) {
    return resources[0].refreshToken;
  }

  return null;
};