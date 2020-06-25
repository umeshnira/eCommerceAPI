import { Router } from 'express';
import subCategoryController from '../controllers/sub-categories.controller';

const router = Router();

router.get('/subcategories/:id([0-9]+)', [], subCategoryController.getSubCategory);

router.get('/subcategories', [], subCategoryController.getSubCategories);

router.get('/subcategories/path', [], subCategoryController.getAllSubCategories);

router.get('/categories/:id([0-9]+)/:id([0-9]+)/subcategories', [], subCategoryController.getsubCategoriesByCategoryId);

router.post('/subcategories', [], subCategoryController.createSubCategory);

router.put('/subcategories/:id([0-9]+)', [], subCategoryController.updateSubCategory);

router.delete('/subcategories/:id([0-9]+)', [], subCategoryController.deleteSubCategory);

export default router;