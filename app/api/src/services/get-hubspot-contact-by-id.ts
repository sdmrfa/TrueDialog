import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import HubSpotClient from './hubspotClient';
import HubspotAccessToken from '../types/hubspot-access-token';
import { HubspotContactPropertyNamesEnum } from '../types/hubspot-contact-property-names-enum';

const getHubspotContactById = async ( {
    hubspotContactId,
    refreshedHubspotAccessToken,
}: {
    hubspotContactId: string;
    refreshedHubspotAccessToken: HubspotAccessToken;
} ): Promise<SimplePublicObject | undefined> => {
    try {
        const properties = Object.values( HubspotContactPropertyNamesEnum );

        return await HubSpotClient(refreshedHubspotAccessToken.access_token).crm.contacts.basicApi.getById( hubspotContactId, properties );
    } catch ( err ) {
        console.log( "Error", err )
    }
};

export default getHubspotContactById;
