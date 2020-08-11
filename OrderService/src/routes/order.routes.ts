import { Router } from 'express';
import orderController from '../controllers/order.controller';
import file_upload from '../utils/image-upload';
import settings from '../config/app-settings.json';
import { setUploadPath } from '../middlewares';

const router = Router();

router.get(
    '/orders', [], orderController.getOrders);

router.get(
    '/orders/:id([0-9]+)', [], orderController.getOrder);

router.post(
    '/orders/:id([0-9]+)/mail', [], orderController.getOrderForMail);

router.get(
    '/orders/:id([0-9]+)/user', [], orderController.getUserOrders);

router.post(
    '/orders', [], orderController.createOrder);

router.put(
    '/orders/:id([0-9]+)/:detailId([0-9]+)', [], orderController.updateOrder);

router.patch(
        '/orders/:id([0-9]+)/status', [], orderController.orderStatusChange);

router.delete(
    '/orders/:id([0-9]+)', [], orderController.deleteOrder);

// router.post(
//     '/cancel/orders/:id([0-9]+)', [], orderController.cancelOrder);

// router.get(
//     '/cancel/orders/:id([0-9]+)', [], orderController.getUserCancelOrders);

    router.get(
        '/orders/:id([0-9]+)/status', [], orderController.getUserOrdersByStatus);

router.post(
    '/orders/return', [], orderController.returnOrder);

// router.get(
//     '/orders/buyAgain/:id([0-9]+)', [], orderController.getBuyAgain);

// router.get(
//     '/orders/openOrder/:id([0-9]+)', [], orderController.getYourOrder);

router.get(
    '/orders/sellerorders/:id([0-9]+)', [], orderController.getSellerOrders);
router.get(
    '/orders/sellerreturnorders/:id([0-9]+)', [], orderController.getSellerReturnOrders);

export default router;