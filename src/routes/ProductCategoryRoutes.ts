import { Router } from 'express';
import ProductCateegoryController from '../controllers/ProductCategoryController';

const router = Router();

// Create a new product category
router.post('/', [], ProductCateegoryController.createProductCategory);

// List categories
router.get('/', [], ProductCateegoryController.getAllproductCategories);

export default router;