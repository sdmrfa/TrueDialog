// src/cosmos/cosmosInit.ts
import { CosmosClient, Container } from '@azure/cosmos';

let tokenContainer: Container;
let associateContainer: Container;
let conversationContainer: Container;

export async function initCosmos() {
  const client = new CosmosClient( {
    endpoint: process.env.COSMOS_DB_ENDPOINT!,
    key: process.env.COSMOS_DB_KEY!,
  } );

  const database = client.database( process.env.COSMOS_DB_DATABASE! );

  const token = await database.containers.createIfNotExists( {
    id: 'tokens',
    partitionKey: { paths: ['/id'] },
  } );

  const associate = await database.containers.createIfNotExists( {
    id: 'associates',
    partitionKey: { paths: ['/id'] },
  } );

  const conversation = await database.containers.createIfNotExists( {
    id: 'conversations',
    partitionKey: { paths: ['/id'] },
  } );

  tokenContainer = token.container;
  associateContainer = associate.container;
  conversationContainer = conversation.container;

  console.log( 'Cosmos DB connected and containers are ready.' );
}

export { tokenContainer, associateContainer, conversationContainer };
