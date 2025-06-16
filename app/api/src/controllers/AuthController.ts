import { Request, Response } from 'express';
import { createHubspotProperties } from '../services/createHubspotProperties';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const client_id = process.env.CLIENT_ID || '';
const client_secret = process.env.CLIENT_SECRET || '';
const redirect_uri = process.env.REDIRECT_URI || '';


const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
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
      const response = await axios.post( 'https://api.hubapi.com/oauth/v1/token', tokenPayload, { headers } );
      console.log( response.data )
      res.status( 200 ).json( response.data );
      const accessToken = ( response.data as any ).access_token;
      await createHubspotProperties( accessToken );

    } catch ( error: any ) {
      console.error( 'Token exchange failed:', error.response?.data || error.message );
      res.status( 500 ).json( {
        error: 'OAuth token exchange failed',
        details: error.response?.data || error.message,
      } );
    }
  }

}

export default AuthController;
