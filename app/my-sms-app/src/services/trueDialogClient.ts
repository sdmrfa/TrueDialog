import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class TrueDialog {
  private apiKey: string;
  private apiSecret: string;
  private axiosClient: AxiosInstance;

  constructor({
    trueDialogApiKey,
    trueDialogApiSecret,
  }: {
    trueDialogApiKey: string;
    trueDialogApiSecret: string;
  }) {
    this.apiKey = trueDialogApiKey;
    this.apiSecret = trueDialogApiSecret;
    this.axiosClient = axios.create({ baseURL: process.env.TRUE_DIALOG_BASEURL });
  }

  public getInstance() {
    return this.axiosClient;
  }

  public setHeaders() {
    const encodedToken = this.createEncodedToken();
    this.axiosClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Basic ${encodedToken}`;

      return config;
    });

    return this;
  }

  private createEncodedToken() {
    const basicAuthToken = `${this.apiKey}:${this.apiSecret}`;

    const encodedToken = Buffer.from(basicAuthToken).toString('base64');

    return encodedToken;
  }
}

export default TrueDialog;
