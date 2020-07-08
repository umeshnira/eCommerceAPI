import { Router } from 'express';
import CartController from '../controllers/carts.controller';

const router = Router();

router.get('/carts', [], CartController.getCartItems);

router.post('/carts', [], CartController.createCart);

router.put('/carts/:id([0-9]+)', [], CartController.updateCart);

router.delete('/carts/:id([0-9]+)', [], CartController.deleteCart);

export default router;