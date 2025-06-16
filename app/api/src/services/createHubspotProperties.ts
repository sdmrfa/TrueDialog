import axios from 'axios';
import hubspotCustomProperties from '../constants/hubspot-custom-properties';

export async function createHubspotProperties( accessToken: string ): Promise<void> {
    for ( const property of hubspotCustomProperties ) {
        try {
            await axios.post( `https://api.hubapi.com/properties/v1/contacts/properties`, property,
                {
                    headers: {
                        Authorization: `Bearer ${ accessToken }`,
                    },
                }
            );
            console.log( `✅ Property Created "${ property.name }".` );
        } catch ( err: any ) {
            const message = err?.response?.data?.message
            console.log( "Error creating properties: ", message )
        }
    }
}
