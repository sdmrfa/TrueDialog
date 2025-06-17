import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class IframeController {

  static async Associate( req: Request, res: Response ): Promise<void> {
    const data = req.body;
    console.log( "Request Body========>", req.body )
    const portalId =data.portalId;
    const userEmail =data.userEmail;
    const userId =data.userId;
    res.json( {
      response: {
        iframeUrl: process.env.APP_SETTINGS_IFRAME_URL + `?portalId=${ portalId }&userEmail=${ userEmail }&userId=${ userId }`,
      }
    } );

  }

}

export default IframeController;
