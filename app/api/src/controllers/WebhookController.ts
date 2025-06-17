import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import refreshHubspotOAuthToken from '../services/refreshHubspotOAuthToken'
import { getRefreshTokenByPortalId } from '../services/cosmosDb'
dotenv.config();

const accountId = process.env.ACCOUNT_ID || '';
const contactId = process.env.CONTACT_ID || '';
const apiKey = process.env.API_KEY || '';
const apiSecret = process.env.API_SECRET || '';
const subScriptionId = process.env.SUBSCRIPTION_ID || '';

interface HubspotAccessToken {
  token_type: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  user: string;
}


const getHubSpotAccessToken = async ( portalId: string ): Promise<HubspotAccessToken> => {
  const hubspotRefreshToken = await getRefreshTokenByPortalId( portalId );

  if ( !hubspotRefreshToken ) {
    throw new Error( `No refresh token found for portal ID: ${ portalId }` );
  } return await refreshHubspotOAuthToken( hubspotRefreshToken );
};

class WebhookController {

  static async HubSpotToTrueDialog( req: Request, res: Response ): Promise<void> {
    // const { portalId, propertyValue, objectId } = hubspotPayload;

    const data = req.body[0]
    const portalIdStr = data.portalId.toString();
    const hubSpotAccessToken = await getHubSpotAccessToken( portalIdStr );


    const authString = Buffer.from( `${ apiKey }:${ apiSecret }` ).toString( 'base64' );
    const headers = {
      'Authorization': `Basic ${ authString }`,
      'Content-Type': 'application/json'
    };

    console.log( "Incoming Data=========>", data )
    const payload = {
      "smsEnabled": data.propertyValue == '1' ? false : true,
      "mmsEnabled": false,
      "emailEnabled": false,
      "voiceEnabled": false
    }
    console.log( "Payload=========>", payload )
    try {
      const response = await axios.put( `https://api.truedialog.com/api/v2.1/account/${ accountId }/contact/${ contactId }/subscription/${ subScriptionId }?overrideSubscription=overrideSubscription`, payload, { headers } );
      console.log( "response=============>", response.data )
      res.status( 200 ).json( response.data );


    } catch ( error: any ) {
      console.error( 'Token exchange failed:', error.response );
      // res.status( 500 ).json( {
      //   error: 'OAuth token exchange failed',
      //   details: error.response?.data || error.message,
      // } );
    }
  }
  static async TrueDialogToHubspot( req: Request, res: Response ): Promise<void> {

  }

}

export default WebhookController;
