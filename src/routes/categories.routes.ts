import { Router } from 'express';
import categoryController from '../controllers/categories.controller';

const router = Router();

router.post('/categories', [], categoryController.createCategory);

router.get('/categories', [], categoryController.getCategories);

router.get('/categories/:id([0-9]+)', [], categoryController.getCategory);

// router.get('/:id([0-9]+)/subCategories/:sid([0-9]+)', [], categoryController.getsubCategoryAganistCategoryId);

router.put('/categories/:id([0-9]+)', [], categoryController.updateCategory);

router.delete('/categories/:id([0-9]+)', [], categoryController.deleteCategory);

export default router;