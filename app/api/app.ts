import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { initCosmos } from './src/services/cosmos/cosmosInit';
import { initPostgres } from './src/services/postgresql/postgresInit';
const cors = require( 'cors' );


dotenv.config();
const app: Express = express();
const port = 8080;

import authRoutes from './src/routes/authRoutes';
import iframRoutes from './src/routes/iframRoutes';
import webhookRoutes from './src/routes/webhookRoutes';
import tdRoutes from './src/routes/tdRoutes';

app.use( express.json() );
app.use( express.static( 'public' ) );
app.use( cors( { origin: '*' } ) );

app.get( '/', ( req: Request, res: Response ) => {
  res.send( 'Hello, True Dialog!' );
} );

app.use( '/api/auth', authRoutes );
app.use( '/api/iframe', iframRoutes );
app.use( '/api/td', tdRoutes );
app.use( '/api/webhook', webhookRoutes );

app.listen( port, async () => {
  await initCosmos();
  await initPostgres();
  console.log( `Server running at-- http://localhost:${ port }` );
} );


