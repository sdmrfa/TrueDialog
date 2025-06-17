import express, { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router: Router = express.Router();

router.get('/', AuthController.OAuth);
router.post('/associate', AuthController.Associate);

export default router;

