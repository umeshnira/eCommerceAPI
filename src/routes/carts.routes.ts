import { Router } from 'express';
import CartController from '../controllers/carts.controller';

const router = Router();

router.get('/carts/:id([0-9]+)', [], CartController.getCartItems);

router.post('/carts', [], CartController.createCart);

router.patch('/carts/:id([0-9]+)', [], CartController.updateCart);

router.put('/carts/:id([0-9]+)', [], CartController.moveWishListItemToCart);

router.delete('/carts/:id([0-9]+)', [], CartController.deleteCart);

export default router;