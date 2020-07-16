import { Router } from 'express';
import clientController from '../controllers/clients.controller';

const router = Router();

router.get('/clients', [], clientController.getAllClients);

router.get('/clients/:id([0-9]+)', [], clientController.getClient);

router.get('/clients/user/:id([0-9]+)', [], clientController.getDetailsUserID);

// Create a new client
router.post('/clients', [], clientController.createClient);

router.put('/clients/:id([0-9]+)', [], clientController.updateClient);

router.delete('/clients/:id([0-9]+)', [], clientController.deleteClient);

export default router;