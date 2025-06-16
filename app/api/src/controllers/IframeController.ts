import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const client_id = process.env.CLIENT_ID || '';


class IframeController {

  static async Associate( req: Request, res: Response ): Promise<void> {
    const portalId = 242746588;
    const userEmail = "joedoe@example.com";
    const userId = "joedoe@example.com";
    res.json( {
      response: {
        iframeUrl: "https://charming-rabanadas-78c704.netlify.app/" + `?portalId=${ portalId }&userEmail=${ userEmail }&userId=${ userId }`,
      }
    } );
    // res.json( { iframeUrl: 'https://charming-rabanadas-78c704.netlify.app/' } );

  }

}

export default IframeController;
