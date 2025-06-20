export function formatAndOutputErrorMessage({
  errorType,
  hubspotPortalId,
  trueDialogAccountId,
  userEmail,
  hubspotUser
}: {
  errorType: string;
  hubspotPortalId?: string;
  trueDialogAccountId?: string;
  userEmail?: string;
  hubspotUser?: string;
}): void {
  let errorMessage = `ERROR: ${errorType} \n`;
  errorMessage += trueDialogAccountId ? ` TRUEDIALOG ACCOUNT ID: ${trueDialogAccountId}\n` : '';
  errorMessage += hubspotPortalId ? ` HUBSPOT PORTAL ID: ${hubspotPortalId}\n` : '';
  errorMessage += userEmail ? ` USER EMAIL: ${userEmail}\n` : '';
  errorMessage += hubspotUser ? ` HUBSPOT USER: ${hubspotUser}\n` : '';
  console.log(errorMessage);
}