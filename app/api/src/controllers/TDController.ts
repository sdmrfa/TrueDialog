import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import TrueDialogChannel from '../types/true-dialog-channel';
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
import { ServiceBusClient } from '@azure/service-bus';

const serviceBus_connectionString = process.env.SERVICE_BUS_CONNECTION_STRING || '';
const serviceBus_name = process.env.SERVICE_BUS_QUEUE_NAME || 'one_to_one';

const sbClient = new ServiceBusClient( serviceBus_connectionString );
const queueSender = sbClient.createSender( serviceBus_name );

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
            // const sendingData = {
            //     sender: contactPhone,
            //     reciever: channelId,
            //     message: message,
            //     incoming: false,
            //     status: "sending",
            //     createdAt: Date.now()
            // }
            // const saveConv = await CosmosService.saveMessage( hsPortalId, contactPhone, channelId, contactId, sendingData );
            // console.log( "data saved===>", saveConv )
            // res.status( 200 ).json( { message: "Success" } );

            const hash = String( `${ userEmail }-${ hsPortalId }` );
            const trueDialogKeys = await CosmosService.getClientHubspotTrueDialogAccountInfoById( hash );
            if ( !trueDialogKeys ) {
                throw new Error( 'The TrueDialog API keys from the user ' + hash + ' could not be retrieved!\nThis could be due to invalid API keys or an invalid refresh token from HubSpot.\nPlease try to re-authenticate the user. If the problem persists, please contact TrueDialog.' );
            }
            const { trueDialogApiKey, trueDialogApiSecret, trueDialogAccountId, } = trueDialogKeys.clientHubspotTrueDialogAccountInfo;
            console.log( "trueDialogKeys===>", trueDialogKeys )
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
            const hubspotContact = await getHubspotContactById( { hubspotContactId: String( contactId ), refreshedHubspotAccessToken: hubSpotAccessToken, } );

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
            console.log( "trueDialogSMSPayload====>", trueDialogSMSPayload );

            // const smsResponse = await trueDialogAxiosInstance.post(
            //     `/account/${ trueDialogAccountId }/action-pushcampaign`,
            //     trueDialogSMSPayload
            // );
            // const smsItem = {
            //     message: trueDialogSMSPayload.Message,
            //     sender: trueDialogSMSPayload.Channels[0],
            //     logDate: new Date(),
            //     incoming: false,
            //     status: 'sent',
            // };
            // const data = smsResponse.data
            // console.log( "smsResponse===>", data )
            const smsQueuePayload = {
                trueDialog: {
                    apiKey: trueDialogApiKey,
                    apiSecret: trueDialogApiSecret,
                    accountId: trueDialogAccountId
                },
                smsPayload: {
                    Channels: [channelId],
                    Targets: [formatPhoneNumber( contactPhone )],
                    Message: message,
                    Execute: true
                }
            };

            await queueSender.sendMessages( { body: smsQueuePayload } );
            console.log( "✅ Enqueued SMS payload with TrueDialog creds:", smsQueuePayload );
            res.status( 200 ).json( { message: "SMS request queued successfully" } );

            // res.status( 200 ).json( { message: 'Success', data } );    
        } catch ( err: any ) {
            // console.log( "err----->", err.response.data )
            console.log( "err----->", err.message )
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            res.status( 500 ).json( {
                message: 'Failed to send SMS',
                error: errorMessage,
            } );
        }
    }
    static async getConversations( req: Request, res: Response ): Promise<void> {
        const payload = req.body;
        console.log( "Payload of Conversation", payload )

        const { hsPortalId, userEmail, phoneNumber } = payload;

        if ( !phoneNumber ) {
            res.status( 400 ).json( { message: "Missing phoneNumber in request body" } );
        }

        const hash = `${ userEmail }-${ hsPortalId }`;

        const trueDialogKeys = await CosmosService.getClientHubspotTrueDialogAccountInfoById( hash );
        if ( !trueDialogKeys ) {
            throw new Error( `The TrueDialog API keys from the user ${ hash } could not be retrieved!
This could be due to invalid API keys or an invalid refresh token from HubSpot.
Please try to re-authenticate the user. If the problem persists, please contact TrueDialog.`);
        }

        const { trueDialogApiKey, trueDialogApiSecret, trueDialogAccountId, } = trueDialogKeys.clientHubspotTrueDialogAccountInfo;
        // console.log( "trueDialogKeys===>", trueDialogKeys );

        const trueDialogAxiosInstance = createTrueDialogClient( { trueDialogApiKey, trueDialogApiSecret, } );

        try {
            // const encodedPhone = encodeURIComponent( phoneNumber );

            const startDate = '2024-07-18T23:59:59';
            const endDate = '2025-07-20T00:00:00';
            const top = 5000;
            const skip = 0;

            const filter = `Target eq '${ phoneNumber }' and (Sent eq true or Sent eq false) and LogDate gt '${ startDate }' and LogDate lt '${ endDate }'`;

            // const url = `/account/${ trueDialogAccountId }/newReport/messageLog?$filter=${ filter }&$top=${ top }&$skip=${ skip }`;
            // console.log( `Requesting TrueDialog with URL: ${ url }` );

            const response = await trueDialogAxiosInstance.get(
                `/account/${ trueDialogAccountId }/newReport/messageLog?$filter=${ filter }&$top=${ top }&$skip=${ skip }`
            );
            console.log( "Response Convo===>", response.data )
            res.status( 200 ).json( { message: "Success Fetched Messages", data: response.data } );

        } catch ( err ) {
            formatAndOutputErrorMessage( {
                errorType: 'FAILED TO GET MESSAGE LOGS',
                trueDialogAccountId,
            } );
            res.status( 500 ).json( {
                message: "Failed to fetch message logs",
                error: err instanceof Error ? err.message : err
            } );
        }
    }

}
export default TDController;
