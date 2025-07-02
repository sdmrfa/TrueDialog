import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { optOutHubSpotAccounts } from '../types/opt-out-hubspot-accounts';
import HubspotAccessToken from '../types/hubspot-access-token';
import updateHubspotContact from '../jobs/update-hubspot-contact';

const updateHubspotContactsByTrueDialogAccount = async (
  accounts: optOutHubSpotAccounts[]
): Promise<void> => {
  await Promise.all(
    accounts.map(async (account) => {
      const {
        hubspotContacts,
        refreshedHubspotAccessToken,
        propertiesToUpdate,
      }: {
        hubspotContacts: SimplePublicObject[];
        refreshedHubspotAccessToken: HubspotAccessToken;
        propertiesToUpdate: SimplePublicObject['properties'];
      } = account;

      await Promise.all(
        hubspotContacts.map(async ({ id }) => {
          try {
            const response = await updateHubspotContact({contactId: id,refreshedHubspotAccessToken,propertiesToUpdate,});
            console.log(`Updated contact ${id}:`, response);
          } catch (err: any) {
            console.error(`Failed to update contact ${id}:`, err.message);
          }
        })
      );
    })
  );
};


export default updateHubspotContactsByTrueDialogAccount;
