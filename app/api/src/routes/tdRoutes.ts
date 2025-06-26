import express, { Router } from 'express';
import TDController from '../controllers/TDController';

const router: Router = express.Router();

router.post( '/get-channels', TDController.getChannels );
router.post( '/send-sms', TDController.sendSms );

export default router;

