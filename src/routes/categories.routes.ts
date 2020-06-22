import { Router } from 'express';
import categoryController from '../controllers/categories.controller';

const router = Router();

router.post('/', [], categoryController.createCategory);

router.get('/', [], categoryController.getCategories);

router.get('/:id([0-9]+)', [], categoryController.getCategory);

router.get('/:id([0-9]+)/subCategories', [], categoryController.getsubCategoriesAganistCategoryId);

// router.get('/:id([0-9]+)/subCategories/:sid([0-9]+)', [], categoryController.getsubCategoryAganistCategoryId);

router.put('/:id([0-9]+)', [], categoryController.updateCategory);

router.delete('/:id([0-9]+)', [], categoryController.deleteCategory);

export default router;