import { Router } from 'express';
import subCategoryController from '../controllers/sub-categories.controller';

const router = Router();

router.post('/', [], subCategoryController.createSubCategory);

// router.get('/', [], subCategoryController.getSubCategories);

router.get('/:id([0-9]+)', [], subCategoryController.getSubCategory);

router.patch('/:id([0-9]+)', [], subCategoryController.updateSubCategory);

router.delete('/:id([0-9]+)', [], subCategoryController.deleteSubCategory);

export default router;