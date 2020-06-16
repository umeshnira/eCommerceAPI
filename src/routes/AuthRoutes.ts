import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

// Create a new client
router.post('/', [], AuthController.createClient);

// List clients
router.get('/', [], AuthController.getAllClients);

export default router;