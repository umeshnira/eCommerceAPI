import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';

const router = Router();

// Create a new client
router.post('/', [], AuthController.createUser);

export default router;