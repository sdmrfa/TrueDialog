import express, { Router } from 'express';
import IframeController from '../controllers/IframeController';

const router: Router = express.Router();

router.post( '/associate', IframeController.Associate );

export default router;

