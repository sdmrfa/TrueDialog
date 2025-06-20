import { Client } from '@hubspot/api-client';

const hubspotClient = (hubspotAccessToken: string): Client => {
  return new Client({ accessToken: hubspotAccessToken });
};

export default hubspotClient;
