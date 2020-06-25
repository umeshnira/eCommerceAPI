"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sub_categories_controller_1 = __importDefault(require("../controllers/sub-categories.controller"));
const router = express_1.Router();
router.get('/subcategories/:id([0-9]+)', [], sub_categories_controller_1.default.getSubCategory);
router.get('/subcategories', [], sub_categories_controller_1.default.getSubCategories);
router.get('/subcategories/path', [], sub_categories_controller_1.default.getAllSubCategories);
router.get('/categories/:id([0-9]+)/:id([0-9]+)/subcategories', [], sub_categories_controller_1.default.getsubCategoriesByCategoryId);
router.post('/subcategories', [], sub_categories_controller_1.default.createSubCategory);
router.put('/subcategories/:id([0-9]+)', [], sub_categories_controller_1.default.updateSubCategory);
router.delete('/subcategories/:id([0-9]+)', [], sub_categories_controller_1.default.deleteSubCategory);
exports.default = router;
//# sourceMappingURL=sub-categories.routes.js.map