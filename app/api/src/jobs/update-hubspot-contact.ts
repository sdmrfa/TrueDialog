import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import HubSpotClient from '../services/hubspotClient';
import HubspotAccessToken from '../types/hubspot-access-token';
import Limiter from '../utils/bottleneck';
import { formatAndOutputErrorMessage } from '../utils/error-logs/format-and-output-error-message';

const updateHubspotContact = async ( {
    contactId,
    refreshedHubspotAccessToken,
    propertiesToUpdate,
}: {
    contactId: string;
    refreshedHubspotAccessToken: HubspotAccessToken;
    propertiesToUpdate: SimplePublicObject['properties'];
} ): Promise<SimplePublicObject | undefined> => {
    try {
        const cleanedProperties: { [key: string]: string } = Object.fromEntries(
            Object.entries( propertiesToUpdate ).map( ( [key, value] ) => [key, value ?? ''] )
        );

        const updatedContact = await Limiter.schedule( () =>
            HubSpotClient( refreshedHubspotAccessToken.access_token ).crm.contacts.basicApi.update(
                contactId,
                { properties: cleanedProperties }
            )
        );
        return { ...updatedContact };
    } catch ( err ) {
        formatAndOutputErrorMessage( {
            errorType: 'FAILED TO UPDATE HUBSPOT CONTACT',
            hubspotUser: refreshedHubspotAccessToken.user,
        } );
    }
};

export default updateHubspotContact;
