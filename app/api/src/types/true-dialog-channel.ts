export default interface TrueDialogChannel {
  accountId: number;
  type: number;
  name: string;
  label: string;
  description: string;
  defaultLanguageId: number;
  isActive: boolean;
  isMediaEnabled: boolean;
  overrideGroup: number;
  allowVerify: boolean;
  useLongCodes: boolean;
  isChat: boolean;
  deliveryReceiptParsingModeId: number;
  id: number;
}
