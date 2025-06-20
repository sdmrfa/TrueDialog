import { Request, Response } from 'express';
import { createHubspotProperties } from '../services/createHubspotProperties';
import TrueDialog from '../services/trueDialogClient'
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { saveHubSpotToken, getTokensByPortalId, saveAssociateInfo } from '../services/cosmosDb'



const client_id = process.env.CLIENT_ID || '';
const client_secret = process.env.CLIENT_SECRET || '';
const redirect_uri = process.env.REDIRECT_URI || '';


const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const createTrueDialogClient = ( {
  trueDialogApiKey,
  trueDialogApiSecret,
}: {
  trueDialogApiKey: string;
  trueDialogApiSecret: string;
} ) => {
  return new TrueDialog( { trueDialogApiKey, trueDialogApiSecret } ).setHeaders().getInstance();
};

const checkAccountCredendials = async ( {
  trueDialogApiKey,
  trueDialogApiSecret,
  trueDialogAccountId,
}: {
  trueDialogApiKey: string;
  trueDialogApiSecret: string;
  trueDialogAccountId: string;
} ) => {
  const trueDialogAxiosInstance = createTrueDialogClient( {
    trueDialogApiKey,
    trueDialogApiSecret,
  } );

  try {
    const accountInfoResponse = await trueDialogAxiosInstance.get(
      `/account/${ trueDialogAccountId }`
    );

    return accountInfoResponse?.data?.id;
  } catch ( _err ) {
    return false;
  }
};

class AuthController {

  static async OAuth( req: Request, res: Response ): Promise<void> {
    const { code } = req.query;

    if ( !code ) {
      console.log( 'Missing authorization code.' )
      res.status( 400 ).json( { error: 'Missing authorization code.' } );
      return
    }
    const tokenPayload = {
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      code,
    };
    try {
      const tokenRes = await axios.post( 'https://api.hubapi.com/oauth/v1/token', tokenPayload, { headers } );
      console.log( tokenRes.data )
      const { access_token, refresh_token } = tokenRes.data;
      const infoRes = await axios.get( `https://api.hubapi.com/oauth/v1/access-tokens/${ access_token }`
      );
      const portalId = infoRes.data.hub_id.toString();
      console.log( `Retrieved portalId: ${ portalId }` );
      await saveHubSpotToken( portalId, access_token, refresh_token );

      res.status( 200 ).json( { message: 'Success', portalId, refresh_token } );
      await createHubspotProperties( access_token );

    } catch ( error: any ) {
      console.error( 'Token exchange failed:', error.response?.data || error.message );
      res.status( 500 ).json( {
        error: 'OAuth token exchange failed',
        details: error.response?.data || error.message,
      } );
    }
  }

  static async Associate( req: Request, res: Response ): Promise<void> {
    const payload = req.body
    console.log( "REQ BODY ============>", payload )
    const { userEmail, portalId, trueDialogAccountId, trueDialogApiKey, trueDialogApiSecret } = payload;
    const isValidTrueDialogCredentials = await checkAccountCredendials( { trueDialogApiKey, trueDialogApiSecret, trueDialogAccountId, } );
    if ( !isValidTrueDialogCredentials ) {
      res.status( 400 ).json( { success: false, message: 'Invalid TrueDialog credentials' } );
      return
    }
    const tokens = await getTokensByPortalId( portalId );
    if ( !tokens ) {
      throw new Error( `No tokens found for portalId ${ portalId }` );
    }
    console.log( tokens.accessToken, tokens.refreshToken );

    const clientHubspotTrueDialogAccountInfo = {
      refreshToken: tokens.refreshToken,
      trueDialogAccountId,
      trueDialogApiKey,
      trueDialogApiSecret,
    };
    await saveAssociateInfo( userEmail, portalId, clientHubspotTrueDialogAccountInfo );
    res.status( 200 ).json( { message: 'Successfully Associated HubSpot-TrueDialog Accounts' } );

  }
}
export default AuthController;
