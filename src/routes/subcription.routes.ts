import { Router } from 'express';
import SubcriptionController from '../controllers/subscription.controller';

const router = Router();

router.post('/subcription', [], SubcriptionController.createSubcription);

router.put('/subcription/:id([0-9]+)', [], SubcriptionController.updateSubcription);

router.put('/user/:id([0-9]+)/subcription', [], SubcriptionController.editSellerSubcription);

router.get('/subcription', [], SubcriptionController.getAllSubcription);

router.get('/subcription/:id([0-9]+)', [], SubcriptionController.getSubcription);

router.get('/seller/:id([0-9]+)/subcription', [], SubcriptionController.getSellerSubcription);

export default router;