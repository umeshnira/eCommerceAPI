import { Router } from 'express';
import productController from '../controllers/Product.controller';
import file_upload from '../utils/image-upload';
import settings from '../config/app-settings.json';
import { setUploadPath } from '../middlewares';

const router = Router();

router.get(
    '/products', [], productController.getProducts);

router.get(
    '/products/:id([0-9]+)', [], productController.getProduct);

router.get(
    '/categories/:id([0-9]+)/products', [], productController.getProductsByCategoryId);

router.get(
    '/sellers/:id([0-9]+)/products', [], productController.getProductsBySellerId);

router.post(
    '/products', [], setUploadPath(settings.application.storage.product), file_upload.array('image'), productController.createProduct);

router.put(
    '/products/:id([0-9]+)', [], setUploadPath(settings.application.storage.product), file_upload.array('image'), productController.updateProduct);


router.delete(
    '/products/:id([0-9]+)', [], productController.deleteProduct);
  

export default router;