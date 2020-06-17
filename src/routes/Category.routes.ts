import { Router } from 'express';
import ProductController from '../controllers/Product.controller';

const router = Router();

// Create a new product category
router.post('/', [], ProductController.createCategory);

// List categories
router.get('/', [], ProductController.getAllParentCategories);

router.get('/:id([0-9]+)/subCategories', [], ProductController.getsubCategoriesAganistCategoryId);

router.patch('/:id([0-9]+)', [], ProductController.updateCategory);

router.delete('/:id([0-9]+)', [], ProductController.deleteCategory);

export default router;