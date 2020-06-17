import { Router } from 'express';
import ProductController from '../controllers/Product.controller';

const router = Router();

// Create a new product category
router.post('/', [], ProductController.createProduct);

// List categories
// router.get('/', [], ProductController.getAllParentCategoriesByName);


export default router;