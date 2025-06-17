import dotenv from 'dotenv';
import { Client } from '@hubspot/api-client';
dotenv.config();

const developerApiKey = process.env.DEVELOPER_API_KEY || 'na2-b0ea-5483-4b3a-8224-f3b5ede47967';
const appId = process.env.HUBSPOT_APP_ID || 14206964;

async function registerWebhook(): Promise<void> {
    const hubspotClient = new Client( { developerApiKey } );
    const SubscriptionCreateRequest: any = {
        objectTypeId: '0-1',
        propertyName: 'sms_is_opted',
        active: true,
        eventType: 'contact.propertyChange',
    };

    try {
        const apiResponse = await hubspotClient.webhooks.subscriptionsApi.create(
            Number( appId ),
            SubscriptionCreateRequest
        );
        console.log( 'Webhook subscription created:', apiResponse );
    } catch ( e: any ) {
        console.error( 'Error creating webhook subscription', e.response || e.message );
    }
}

const callFunc = async () => {
    await registerWebhook();
};

callFunc();
