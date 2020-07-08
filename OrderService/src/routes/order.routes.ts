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

router.get(
    '/user/orders/:id([0-9]+)', [], orderController.getUserOrders);

router.post(
    '/orders', [], orderController.createOrder);

router.put(
    '/orders/:id([0-9]+)/:detailId([0-9]+)', [], orderController.updateOrder);

router.delete(
    '/orders/:id([0-9]+)', [], orderController.deleteOrder);

export default router;