import { Router } from 'express';
import sellersController from '../controllers/sellers.controller';

const router = Router();

// Create a new client
router.post('/', [], sellersController.createSeller);

router.get('/', [], sellersController.getAllSellers);

router.get('/:id([0-9]+)', [], sellersController.getSeller);

router.delete('/:id([0-9]+)', [], sellersController.deleteSeller);

router.put('/:id([0-9]+)', [], sellersController.updateSeller);

export default router;