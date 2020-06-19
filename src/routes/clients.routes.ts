import { Router } from 'express';
import clientController from '../controllers/clients.controller';

const router = Router();

// Create a new client
router.post('/', [], clientController.createClient);

router.get('/', [], clientController.getAllClients);

router.get('/:id([0-9]+)', [], clientController.getClient);

router.delete('/:id([0-9]+)', [], clientController.deleteClient);

export default router;