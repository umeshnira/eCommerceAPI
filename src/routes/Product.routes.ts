import { Router } from 'express';
import productController from '../controllers/Product.controller';

const router = Router();

// Create a new product category
router.post('/', [], productController.createProduct);

// List categories
router.get('/', [], productController.getAllProducts);

router.get('/:id([0-9]+)', [], productController.getProduct);

router.put('/:id([0-9]+)', [], productController.updateProduct);

router.delete('/:id([0-9]+)', [], productController.deleteProduct);

router.get('/:id([0-9]+)', [], productController.getAllProductAganistCategoryId);


export default router;