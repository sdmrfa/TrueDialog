export interface HubspotTrueDialogAccountAssociationPayload {
  trueDialogAccountId: string;
  trueDialogApiKey: string;
  trueDialogApiSecret: string;
  portalId: string;
  userEmail: string;
  userId: string;
}

export interface HubspotTrueDialogAccountAssociationRedis {
  refreshToken: string;
  trueDialogAccountId: string;
  trueDialogApiKey: string;
  trueDialogApiSecret: string;
}
