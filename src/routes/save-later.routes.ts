import { Router } from 'express';
import SaveLaterController from '../controllers/save-later.controller';


const router = Router();


router.post(
    '/savelater', [], SaveLaterController.createSaveLater);

router.put(
    '/savelater/:id([0-9]+)', [], SaveLaterController.updateSaveLater);

router.get(
    '/savelater', [], SaveLaterController.getSaveLaterItems);

router.delete(
    '/savelater/:id([0-9]+)', [], SaveLaterController.deleteSaveLater);

    router.post(
        '/savelater/:id([0-9]+)', [], SaveLaterController.moveSaveLaterToCart);

export default router;