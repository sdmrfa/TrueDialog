import { Request, Response } from 'express';
import TrueDialogChannel from '../types/true-dialog-channel';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import CosmosService from '../services/cosmos/cosmosDb'
import createTrueDialogClient from '../services/trueDialogInstance';
import { formatAndOutputErrorMessage } from '../utils/error-logs/format-and-output-error-message';
import getHubspotContactById from '../services/get-hubspot-contact-by-id';
import { HubspotContactPropertyNamesEnum } from '../types/hubspot-contact-property-names-enum';
import formatPhoneNumber from '../utils/templates/format-phone-number';
import getTrueDialogContact from '../jobs/get-truedialog-contact';
import getTrueDialogContactSubscriptions from '../jobs/get-true-dialog-contact-subscriptions';
import HubspotAccessToken from '../types/hubspot-access-token';
import refreshHubspotOAuthToken from '../services/refreshHubspotOAuthToken';



const client_id = process.env.CLIENT_ID || '';
const client_secret = process.env.CLIENT_SECRET || '';
const redirect_uri = process.env.REDIRECT_URI || '';


const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
};

const getHubSpotAccessToken = async ( portalId: string ): Promise<HubspotAccessToken> => {
    const hubspotRefreshToken = await CosmosService.getRefreshTokenByPortalId( portalId );

    if ( !hubspotRefreshToken ) {
        throw new Error( `No refresh token found for portal ID: ${ portalId }` );
    }
    return await refreshHubspotOAuthToken( hubspotRefreshToken );
};

class TDController {

    static async getChannels( req: Request, res: Response ): Promise<void> {
        const payload = req.body
        const { hsPortalId, userEmail } = payload;
        const hash = String( `${ userEmail }-${ hsPortalId }` );
        const trueDialogKeys = await CosmosService.getClientHubspotTrueDialogAccountInfoById( hash );
        if ( !trueDialogKeys ) {
            throw new Error( 'The TrueDialog API keys from the user ' + hash + ' could not be retrieved!\nThis could be due to invalid API keys or an invalid refresh token from HubSpot.\nPlease try to re-authenticate the user. If the problem persists, please contact TrueDialog.' );
        }
        if ( !trueDialogKeys ) {
            throw new Error( "No TrueDialog account info found" );
        }
        const {
            trueDialogApiKey,
            trueDialogApiSecret,
            trueDialogAccountId,
        } = trueDialogKeys.clientHubspotTrueDialogAccountInfo;
        console.log( trueDialogKeys )
        const trueDialogAxiosInstance = createTrueDialogClient( { trueDialogApiKey, trueDialogApiSecret, } );

        try {
            const persistedTrueDialogChannelList = await trueDialogAxiosInstance.get<TrueDialogChannel[]>(
                `/account/${ trueDialogAccountId }/channel`
            );
            const persistedLongCodeList = await trueDialogAxiosInstance.get<any>(
                `/account/${ trueDialogAccountId }/long-code-direct`
            );

            console.log( "persistedTrueDialogChannelList===>", persistedTrueDialogChannelList.data )
            console.log( "persistedLongCodeList===>", persistedLongCodeList.data )
            const data = [
                ...persistedTrueDialogChannelList.data,
                ...persistedLongCodeList.data,
            ]
            res.status( 200 ).json( { message: 'Success', data } );

        } catch ( err ) {
            formatAndOutputErrorMessage( {
                errorType: 'FAILED TO GET CHANNELS',
                trueDialogAccountId,
            } );
        }
    }
    static async sendSms( req: Request, res: Response ): Promise<void> {
        console.log( "reqbody===>", req.body )
        try {
            const { hsPortalId, channelId, userEmail, contactPhone, message, contactId, contactName } = req.body
            const sendingData = {
                sender: contactPhone,
                reciever: channelId,
                message: message,
                incoming: false,
                status: "sending",
                createdAt: Date.now()
            }
            const saveConv = await CosmosService.saveMessage( hsPortalId, contactPhone, channelId, contactId, sendingData );
            // console.log( "data saved===>", saveConv )
            res.status( 200 ).json( { message: "Success" } );

            const hash = String( `${ userEmail }-${ hsPortalId }` );
            const trueDialogKeys = await CosmosService.getClientHubspotTrueDialogAccountInfoById( hash );
            if ( !trueDialogKeys ) {
                throw new Error( 'The TrueDialog API keys from the user ' + hash + ' could not be retrieved!\nThis could be due to invalid API keys or an invalid refresh token from HubSpot.\nPlease try to re-authenticate the user. If the problem persists, please contact TrueDialog.' );
            }
            if ( !trueDialogKeys ) {
                throw new Error( "No TrueDialog account info found" );
            }
            const { trueDialogApiKey, trueDialogApiSecret, trueDialogAccountId, } = trueDialogKeys.clientHubspotTrueDialogAccountInfo;
            // console.log( trueDialogKeys )
            if ( !channelId ) {
                formatAndOutputErrorMessage( {
                    errorType: 'CHANNEL ID IS REQUIRED',
                    trueDialogAccountId,
                } );
                throw new Error( 'Channel ID is required' );
            }
            if ( !contactPhone ) {
                formatAndOutputErrorMessage( {
                    errorType: 'CONTACT PHONE IS REQUIRED',
                    trueDialogAccountId,
                } );
                throw new Error( 'Contact phone is required' );
            }
            if ( !message ) {
                formatAndOutputErrorMessage( {
                    errorType: 'MESSAGE IS REQUIRED',
                    trueDialogAccountId,
                } );
                throw new Error( 'Message is required' );
            }
            const trueDialogAxiosInstance = createTrueDialogClient( { trueDialogApiKey, trueDialogApiSecret, } );
            const hubSpotAccessToken = await getHubSpotAccessToken( String( hsPortalId ) );
            if ( !hubSpotAccessToken ) {
                throw new Error( `No tokens found for portalId ${ hsPortalId }` );
            }
            console.log( hubSpotAccessToken );
            const hubspotContact = await getHubspotContactById( {
                hubspotContactId: String( contactId ),
                refreshedHubspotAccessToken: hubSpotAccessToken,
            } );

            if ( !hubspotContact ) {
                console.log( "hubspotContact not found !!!" );

                return;
            }
            // console.log( "hubspotContact====>", hubspotContact );

            const formattedPhoneNumber = formatPhoneNumber(
                hubspotContact.properties[HubspotContactPropertyNamesEnum.MOBILE_PHONE]
            );
            const trueDialogContact = await getTrueDialogContact( {
                contactPhone: formattedPhoneNumber,
                trueDialogAxiosInstance,
                trueDialogAccountId: trueDialogAccountId,
            } );

            if ( !trueDialogContact ) {
                return;
            }
            const [trueDialogSubscription] = await getTrueDialogContactSubscriptions( {
                trueDialogAccountId,
                trueDialogAxiosInstance,
                trueDialogContactId: trueDialogContact.id,
            } );

            const { smsEnabled } = trueDialogSubscription || {};

            if ( !smsEnabled ) {
                throw new Error( 'The contact is opted-out' );
            }

            const trueDialogSMSPayload = { Channels: [channelId], Targets: [formatPhoneNumber( contactPhone )], Message: message, Execute: true, };

            const smsResponse = await trueDialogAxiosInstance.post(
                `/account/${ trueDialogAccountId }/action-pushcampaign`,
                trueDialogSMSPayload
            );

            const smsItem = {
                message: trueDialogSMSPayload.Message,
                sender: trueDialogSMSPayload.Channels[0],
                logDate: new Date(),
                incoming: false,
                status: 'sent',
            };
            const data = smsResponse.data
            console.log( "smsResponse===>", smsResponse )
            console.log( "smsResponse===>", smsResponse.data )
            res.status( 200 ).json( { message: 'Success', smsItem } );
            // res.status( 200 ).json( { message: 'Success', data } );    
        } catch ( err ) {
            formatAndOutputErrorMessage( {
                errorType: 'FAILED TO SEND MESSAGE',
            } );
        }
    }
}
export default TDController;
