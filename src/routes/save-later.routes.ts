import { Router } from 'express';
import SaveLaterController from '../controllers/save-later.controller';

const router = Router();

router.get('/savelater/:uid([0-9]+)', [], SaveLaterController.getSaveLaterItemsByUserId);

router.post('/savelater', [], SaveLaterController.createSaveLater);

router.put('/savelater/:id([0-9]+)', [], SaveLaterController.updateSaveLater);

router.delete('/savelater/:id([0-9]+)', [], SaveLaterController.deleteSaveLater);

export default router;