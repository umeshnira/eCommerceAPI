import { Router } from 'express';
import OfferController from '../controllers/offer.controller';

const router = Router();

router.post('/offer', [], OfferController.createOffer);

router.post('/offer/:id([0-9]+)', [], OfferController.createMultipleProductsOffer);

router.put('/offer/:id([0-9]+)', [], OfferController.editOffer);

router.get('/offer', [], OfferController.getAllOffers);

router.get('/status/:status([0-9]+)/offer', [], OfferController.getOffersByStatus);

router.get('/offer/:id([0-9]+)', [], OfferController.getOffer);

router.patch('/offer/:id([0-9]+)', [], OfferController.statusChangeOffer);

router.get('/product/:id([0-9]+)/offer', [], OfferController.getProductOffers);


export default router;