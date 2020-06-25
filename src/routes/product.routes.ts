import { Router } from 'express';
import productController from '../controllers/Product.controller';
import file_upload from '../utils/image-upload';

const router = Router();

// Create a new product category
router.post('/products', [], file_upload.array('image'), productController.createProduct);

// List categories
router.get('/products', [], productController.getAllProducts);

router.get('/products/:id([0-9]+)', [], productController.getProduct);

router.put('/products/:id([0-9]+)', [],file_upload.array('image'), productController.updateProduct);

router.delete('/products/:id([0-9]+)', [], productController.deleteProduct);

router.get('/categories/:id([0-9]+)/products/:id([0-9]+)', [], productController.getAllProductAganistCategoryId);


export default router;