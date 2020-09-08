import { Router } from 'express';
import SubcriptionController from '../controllers/subscription.controller';

const router = Router();

router.post('/subcription', [], SubcriptionController.createSubcription);

router.put('/user/:id([0-9]+)/subcription', [], SubcriptionController.editSubcription);

router.get('/subcription', [], SubcriptionController.getAllSubcription);

router.get('/seller/:id([0-9]+)/subcription', [], SubcriptionController.getSellerSubcription);

export default router;