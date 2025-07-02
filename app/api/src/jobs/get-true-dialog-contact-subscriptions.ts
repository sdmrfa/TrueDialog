import { AxiosInstance } from 'axios';
import TrueDialogContactSubscription from '../types/true-dialog-contact-subscription';
import { formatAndOutputErrorMessage } from '../utils/error-logs/format-and-output-error-message';

const getTrueDialogContactSubscriptions = async ({
  trueDialogContactId,
  trueDialogAxiosInstance,
  trueDialogAccountId,
}: {
  trueDialogContactId: number;
  trueDialogAxiosInstance: AxiosInstance;
  trueDialogAccountId: string;
}): Promise<TrueDialogContactSubscription[]> => {
  try {
    const trueDialogContactSubscriptions = await trueDialogAxiosInstance.get<
      TrueDialogContactSubscription[]
    >(`/account/${trueDialogAccountId}/contact/${trueDialogContactId}/subscription`);
// console.log("Subscription details---->",trueDialogAxiosInstance)
    return trueDialogContactSubscriptions.data;
  } catch (err) {
    formatAndOutputErrorMessage({
      errorType: 'FAILED TO GET CONTACT SUBSCRIPTIONS',
      trueDialogAccountId,
    });

    return [];
  }
};

export default getTrueDialogContactSubscriptions;
