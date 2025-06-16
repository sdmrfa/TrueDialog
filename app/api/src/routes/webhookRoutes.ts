import express, { Router } from 'express';
import WebhookController from '../controllers/WebhookController';

const router: Router = express.Router();

router.post('/hs-td', WebhookController.HubSpotToTrueDialog);
router.post('/td-hs', WebhookController.TrueDialogToHubspot);

export default router;

