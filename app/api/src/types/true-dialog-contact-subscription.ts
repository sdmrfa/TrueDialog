export default interface TrueDialogContactSubscription {
  id: number;
  contactId: number;
  emailEnabled: boolean;
  mmsEnabled: boolean;
  smsEnabled: boolean;
  subscription: boolean;
  subscriptionId: number;
  voiceEnabled: boolean;
}
