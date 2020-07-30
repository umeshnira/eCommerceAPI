import { Router } from 'express';
import OfferController from '../controllers/offer.controller';

const router = Router();

router.post('/offer', [], OfferController.createOffer);

router.put('/offer/:id([0-9]+)', [], OfferController.editOffer);

router.get('/offer', [], OfferController.getAllOffers);

router.get('/status/:status([0-9]+)/offer', [], OfferController.getOffersByStatus);

router.get('/offer/:id([0-9]+)', [], OfferController.getOffer);

router.patch('/offer/:id([0-9]+)', [], OfferController.statusChangeOffer);

export default router;