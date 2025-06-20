export default interface HubspotAccessToken {
  token_type: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  user: string;
}
