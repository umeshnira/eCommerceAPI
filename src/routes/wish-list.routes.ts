import { Router } from 'express';
import WishListController from '../controllers/wish-list.controller';

const router = Router();

router.get('/wishlist/:uid([0-9]+)', [], WishListController.getWishListItemsByUserId);

router.post('/wishlist', [], WishListController.createWishList);

router.put('/wishlist', [], WishListController.moveItemToWishList);

router.delete('/wishlist/:id([0-9]+)', [], WishListController.deleteWishListItem);

export default router;