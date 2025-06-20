import TrueDialogClient from './trueDialogClient';

const createTrueDialogClient = ( {
    trueDialogApiKey,
    trueDialogApiSecret,
}: {
    trueDialogApiKey: string;
    trueDialogApiSecret: string;
} ) => {
    return new TrueDialogClient( { trueDialogApiKey, trueDialogApiSecret } ).setHeaders().getInstance();
};

export default createTrueDialogClient;
