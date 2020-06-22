"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const router = express_1.Router();
router.post('/categories', [], categories_controller_1.default.createCategory);
router.get('/categories', [], categories_controller_1.default.getCategories);
router.get('/categories/:id([0-9]+)', [], categories_controller_1.default.getCategory);
// router.get('/:id([0-9]+)/subCategories/:sid([0-9]+)', [], categoryController.getsubCategoryAganistCategoryId);
router.put('/categories/:id([0-9]+)', [], categories_controller_1.default.updateCategory);
router.delete('/categories/:id([0-9]+)', [], categories_controller_1.default.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.routes.js.map