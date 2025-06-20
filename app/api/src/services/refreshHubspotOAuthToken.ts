import axiosClient from './axios';
import dotenv from 'dotenv';
dotenv.config();

const client_id = process.env.CLIENT_ID || '';
const client_secret = process.env.CLIENT_SECRET || '';
const hubspot_access_token_url = process.env.HUBSPOT_ACCESS_TOKEN_URL || '';

const hubspotAccessTokenHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
};

interface HubspotAccessToken {
    token_type: string;
    refresh_token: string;
    access_token: string;
    expires_in: number;
    user: string;
}

const refreshHubspotOAuthToken = async ( refreshToken: string ): Promise<HubspotAccessToken> => {
    const formData = new URLSearchParams( {
        grant_type: 'refresh_token',
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refreshToken,
    } )

    try {
        const refreshedHubspotToken = await axiosClient.post( hubspot_access_token_url, formData,
            {
                headers: hubspotAccessTokenHeaders,
            }
        );
        return refreshedHubspotToken.data;
    } catch ( err ) {
        console.error( 'Error refreshing HubSpot token:', err );
        throw new Error( 'Failed to refresh HubSpot token' );
    }
};

export default refreshHubspotOAuthToken;
