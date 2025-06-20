import { AxiosInstance } from 'axios';
import TrueDialogContact from '../types/true-dialog-contact';

const getTrueDialogContact = async ( {
  contactPhone,
  trueDialogAxiosInstance,
  trueDialogAccountId,
}: {
  contactPhone: string;
  trueDialogAxiosInstance: AxiosInstance;
  trueDialogAccountId: string;
} ): Promise<TrueDialogContact | undefined> => {
  try {
    const persistedTrueDialogContactList = await trueDialogAxiosInstance.get<TrueDialogContact[]>(
      `/account/${ trueDialogAccountId }/contact-search/${ contactPhone }`
    );
    return persistedTrueDialogContactList.data[0];
  } catch ( err ) {
    console.log( "FAILED TO GET TRUE DIALOG CONTACT", trueDialogAccountId );
    return;
  }
};

export default getTrueDialogContact;
