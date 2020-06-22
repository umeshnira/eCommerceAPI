import { Router } from 'express';
import sellersController from '../controllers/sellers.controller';

const router = Router();

router.get('/sellers', [], sellersController.getAllSellers);

router.get('/sellers/:id([0-9]+)', [], sellersController.getSeller);

// Create a new seller
router.post('/sellers', [], sellersController.createSeller);

router.delete('/sellers/:id([0-9]+)', [], sellersController.deleteSeller);

router.put('/sellers/:id([0-9]+)', [], sellersController.updateSeller);

export default router;