import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts';
import HubspotAccessToken from '../types/hubspot-access-token'
import { formatAndOutputErrorMessage } from '../utils/error-logs/format-and-output-error-message';
import { HubspotContactPropertyNamesEnum } from '../types/hubspot-contact-property-names-enum';
import Limiter from '../utils/bottleneck';
import HubSpotClient from '../services/hubspotClient';

interface GetContactsParams {
    contactPhoneNumber: string;
    refreshedHubspotAccessToken: HubspotAccessToken;
}

const getAllHubspotContactsByPhoneNumber = async ( {
    contactPhoneNumber,
    refreshedHubspotAccessToken,
}: GetContactsParams ): Promise<SimplePublicObject[]> => {
    if ( !contactPhoneNumber ) {
        formatAndOutputErrorMessage( {
            errorType: 'CONTACT PHONE NUMBER IS REQUIRED',
            hubspotUser: refreshedHubspotAccessToken.user,
        } );
        throw new Error( 'Contact phone number is required' );
    }

    try {
        const searchRequestPayload = {
            filterGroups: [
                {
                    filters: [
                        {
                            value: contactPhoneNumber,
                            propertyName: HubspotContactPropertyNamesEnum.MOBILE_PHONE,
                            operator: 'EQ' as FilterOperatorEnum,
                        },
                    ],
                },
            ],
            sorts: [HubspotContactPropertyNamesEnum.MOBILE_PHONE],
            properties: Object.values( HubspotContactPropertyNamesEnum ),
            limit: 50,
            after: '0',
        };

        let hasMore = true;
        const resultContacts: SimplePublicObject[] = [];

        while ( hasMore ) {
            const response = await Limiter.schedule( () =>
                HubSpotClient( refreshedHubspotAccessToken.access_token ).crm.contacts.searchApi.doSearch(
                    searchRequestPayload
                )
            );

            const currentResults = response?.results ?? [];
            resultContacts.push( ...currentResults );

            const nextAfter = Number( response?.paging?.next?.after || 0 );
            hasMore = nextAfter > 0 && currentResults.length > 0;
            searchRequestPayload.after = String( nextAfter );
        }

        return resultContacts;
    } catch ( err ) {
        formatAndOutputErrorMessage( {
            errorType: 'FAILED TO GET HUBSPOT CONTACTS BY PHONE NUMBER',
            hubspotUser: refreshedHubspotAccessToken.user,
        } );
        return [];
    }
};

export default getAllHubspotContactsByPhoneNumber;
