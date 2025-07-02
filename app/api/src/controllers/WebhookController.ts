import axiosClient from '../services/axios';
import { Request, Response } from 'express';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import refreshHubspotOAuthToken from '../services/refreshHubspotOAuthToken'
import CosmosService from '../services/cosmos/cosmosDb'
import getHubspotContactById from '../services/get-hubspot-contact-by-id'
import HubspotAccessToken from '../types/hubspot-access-token';
import TrueDialogContactSubscriptionUpdateInput from '../types/true-dialog-contact-subscription-update-input';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import createTrueDialogClient from '../services/trueDialogInstance'
import getTrueDialogContact from '../jobs/get-truedialog-contact'
import getTrueDialogContactSubscriptions from '../jobs/get-true-dialog-contact-subscriptions'
import { HubspotContactPropertyNamesEnum } from '../types/hubspot-contact-property-names-enum'
import formatPhoneNumber from '../utils/templates/format-phone-number';
import { formatAndOutputErrorMessage } from '../utils/error-logs/format-and-output-error-message';
import getAllHubspotContactsByPhoneNumber from '../jobs/get-all-hubspot-contacts-by-phone-number';
import updateHubspotContactsByTrueDialogAccount from '../jobs/update-hubspot-contacts-by-true-dialog-account';

dotenv.config();

const accountId = process.env.ACCOUNT_ID || '';
const contactId = process.env.CONTACT_ID || '';
const apiKey = process.env.API_KEY || '';
const apiSecret = process.env.API_SECRET || '';
const subScriptionId = process.env.SUBSCRIPTION_ID || '';



const getHubSpotAccessToken = async ( portalId: string ): Promise<HubspotAccessToken> => {
  const hubspotRefreshToken = await CosmosService.getRefreshTokenByPortalId( portalId );

  if ( !hubspotRefreshToken ) {
    throw new Error( `No refresh token found for portal ID: ${ portalId }` );
  }
  return await refreshHubspotOAuthToken( hubspotRefreshToken );
};

const getSubscriptions = async ( portalId: string, hubSpotAccessToken: string, hubspotContact: SimplePublicObject ):
  Promise<{
    trueDialogContactId: number,
    trueDialogAxiosInstance: AxiosInstance,
    trueDialogAccountId: string,
    contactSubscriptions: Array<TrueDialogContactSubscriptionUpdateInput & { subscriptionId: number }>
  }> => {
  const {
    trueDialogApiKey,
    trueDialogApiSecret,
    trueDialogAccountId,
  } = await getTrueDialogKeys( portalId, hubSpotAccessToken );

  const trueDialogAxiosInstance = createTrueDialogClient( {
    trueDialogApiKey: trueDialogApiKey,
    trueDialogApiSecret: trueDialogApiSecret,
  } );
  // console.log( "trueDialogKeys.clientHubspotTrueDialogAccountInfo=>", trueDialogApiKey, trueDialogApiSecret, trueDialogAccountId )

  const trueDialogContact = await getTrueDialogContact( {
    contactPhone: formatPhoneNumber( hubspotContact.properties[HubspotContactPropertyNamesEnum.MOBILE_PHONE] ),
    trueDialogAxiosInstance,
    trueDialogAccountId: trueDialogAccountId,
  } );

  if ( !trueDialogContact ) {
    throw new Error( "TrueDialog contact not found." );
  }
  // console.log( "trueDialogContact Details ===>", trueDialogContact )
  const contactSubscriptions: Array<TrueDialogContactSubscriptionUpdateInput & { subscriptionId: number }>
    = await getTrueDialogContactSubscriptions( {
      trueDialogContactId: trueDialogContact.id,
      trueDialogAxiosInstance: trueDialogAxiosInstance,
      trueDialogAccountId: trueDialogAccountId,
    } );

  return {
    trueDialogContactId: trueDialogContact.id,
    trueDialogAxiosInstance: trueDialogAxiosInstance,
    trueDialogAccountId: trueDialogAccountId,
    contactSubscriptions: contactSubscriptions
  }
};

const getTrueDialogKeys = async ( portalId: string, hubSpotAccessToken: string ):
  Promise<{
    trueDialogApiKey: string,
    trueDialogApiSecret: string,
    trueDialogAccountId: string,
  }> => {
  const response = await axiosClient.get( `https://api.hubapi.com/oauth/v1/access-tokens/${ hubSpotAccessToken }` );
  const user = response.data.user;
  const hash = String( `${ user }-${ portalId }` );
  // console.log( "User Hash key ==>", hash )
  const trueDialogKeys = await CosmosService.getClientHubspotTrueDialogAccountInfoById( hash );

  if ( !trueDialogKeys ) {
    throw new Error( "No TrueDialog account info found" );
  }
  const {
    trueDialogApiKey,
    trueDialogApiSecret,
    trueDialogAccountId,
  } = trueDialogKeys.clientHubspotTrueDialogAccountInfo;

  return {
    trueDialogApiKey: trueDialogApiKey,
    trueDialogApiSecret: trueDialogApiSecret,
    trueDialogAccountId: trueDialogAccountId,
  }
};

class WebhookController {

  static async HubSpotToTrueDialog( req: Request, res: Response ): Promise<void> {

    const data = req.body[0] //live
    // const data = req.body //local
    console.log( "Data Recieved from Hubspot Webhook===>", data )
    const { portalId, propertyValue, objectId } = data;
    const portalIdStr = portalId.toString();
    const hubSpotAccessToken = await getHubSpotAccessToken( portalIdStr );
    // console.log( "Token=>", hubSpotAccessToken )
    const hubspotContact = await getHubspotContactById( {
      hubspotContactId: String( objectId ),
      refreshedHubspotAccessToken: hubSpotAccessToken,
    } );
    if ( !hubspotContact ) {
      console.log( 'Hubspot contact not found' );
      throw new Error( "TrueDialog contact not found." );
    }
    console.log( "Accepted for processing (HubSpot-TrueDialog)" )
    res.status( 200 ).json( { message: 'Accepted for processing (HubSpot-TrueDialog)' } );
    const {
      trueDialogContactId,
      trueDialogAxiosInstance,
      trueDialogAccountId,
      contactSubscriptions } = await getSubscriptions( portalIdStr, hubSpotAccessToken.access_token, hubspotContact )

    if ( !contactSubscriptions ) {
      console.log( 'True Dialog contact subscription not found.' );
    }
    // console.log( "Subscription===>", contactSubscriptions )
    const smsIsOpted = !Boolean( Number( propertyValue ) );

    const isSubscriptionSmsOptionChanged = contactSubscriptions.some( subscription => subscription.smsEnabled !== smsIsOpted );
    const isSmsEnabledToNewSubscription = !contactSubscriptions?.length && smsIsOpted
    const isSmsEnabledChanged = isSubscriptionSmsOptionChanged || isSmsEnabledToNewSubscription

    const authString = Buffer.from( `${ apiKey }:${ apiSecret }` ).toString( 'base64' );
    const headers = {
      'Authorization': `Basic ${ authString }`,
      'Content-Type': 'application/json'
    };
    const payload = {
      "smsEnabled": data.propertyValue == '1' ? false : true,
      "mmsEnabled": false,
      "emailEnabled": false,
      "voiceEnabled": false
    }
    // console.log( "Payload=========>", payload )
    try {
      const response = await axios.put( `https://api.truedialog.com/api/v2.1/account/${ trueDialogAccountId }/contact/${ trueDialogContactId }/subscription/${ subScriptionId }?overrideSubscription=overrideSubscription`, payload, { headers } );
      console.log( "Response from TrueDialog=============>", response.data )
      // res.status( 200 ).json( response.data );

    } catch ( error: any ) {
      console.error( 'Problem with Hubspot To TrueDialog Opt-out:', error.response );
      // res.status( 200 ).json( {
      //   error: 'OAuth token exchange failed',
      //   details: error.response?.data || error.message,
      // } );
    }
  }

  static async TrueDialogToHubspot( req: Request, res: Response ): Promise<void> {
    try {
      console.log( "Data Received from TrueDialog Webhook ===>", req.body );
      const { PhoneNumber: phoneNumber, Subscribed: subscribed, AccountId: trueDialogAccountId, } = req.body;
      const hubSpotAccounts = await CosmosService.getAllHubSpotAccountsByAccountId( trueDialogAccountId );
      // console.log( "hubSpotAccounts====>", hubSpotAccounts )
      console.log( "Accepted for processing (TrueDialog-HubSpot)" )
      res.status( 200 ).json( { message: 'Accepted for processing (TrueDialog-HubSpot)' } );
      const contactsToUpdate = [];

      for ( const account of hubSpotAccounts ) {
        // console.log( "account====>", account )
        const refreshToken = account.clientHubspotTrueDialogAccountInfo.refreshToken;
        // console.log( "Refresh Token====>", refreshToken )
        const refreshedHubspotAccessToken = await refreshHubspotOAuthToken( refreshToken );
        // console.log( "Refreshed AccessToken===>", refreshedHubspotAccessToken )
        if ( !phoneNumber ) {
          formatAndOutputErrorMessage( {
            errorType: 'CONTACT PHONE NUMBER IS REQUIRED',
            hubspotUser: refreshedHubspotAccessToken.user,
          } );
          // throw new InternalError( 'Contact phone number is required' );
        }

        const hubspotContacts = await getAllHubspotContactsByPhoneNumber( {
          refreshedHubspotAccessToken,
          contactPhoneNumber: formatPhoneNumber( phoneNumber ),
        } );
        // console.log( "Hubspot Contacts=>", hubspotContacts )
        const propertiesToUpdate = {
          [HubspotContactPropertyNamesEnum.SMS_OPTED_OUT]: String( Number( !subscribed ) ),
        };

        contactsToUpdate.push( {
          hubspotContacts,
          refreshedHubspotAccessToken,
          propertiesToUpdate,
        } );
      }
      // console.log( "contactsToUpdate==>", contactsToUpdate )
      const dataResponse = await updateHubspotContactsByTrueDialogAccount( contactsToUpdate );
      console.log( "Response from Hubspot===>", dataResponse )
      // res.status( 200 ).json( dataResponse );

      // return contactsToUpdate;

    } catch ( error ) {
      console.error( "Error processing webhook:", error );
      // res.status( 200 ).send( "Internal Server Error" );
    }
  }

}

export default WebhookController;
