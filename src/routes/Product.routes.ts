import { Router } from 'express';
import ProductController from '../controllers/Product.controller';

const router = Router();

// Create a new product category
router.post('/', [], ProductController.createProduct);

// List categories
router.get('/', [], ProductController.getAllProducts);

router.put('/', [], ProductController.updateProduct);

router.delete('/', [], ProductController.deleteProduct);

router.get('/:id([0-9]+)/products', [], ProductController.getAllProductAganistCategoryId);


export default router;