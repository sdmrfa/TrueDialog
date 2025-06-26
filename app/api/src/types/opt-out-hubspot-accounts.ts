import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/objects/emails';
import HubspotAccessToken from '../types/hubspot-access-token';

export type optOutHubSpotAccounts = {
  hubspotContacts: SimplePublicObject[];
  refreshedHubspotAccessToken: HubspotAccessToken;
  propertiesToUpdate: SimplePublicObject['properties'];
}