"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sub_categories_controller_1 = __importDefault(require("../controllers/sub-categories.controller"));
const router = express_1.Router();
router.post('/', [], sub_categories_controller_1.default.createSubCategory);
// router.get('/', [], subCategoryController.getSubCategories);
router.get('/:id([0-9]+)', [], sub_categories_controller_1.default.getSubCategory);
router.patch('/:id([0-9]+)', [], sub_categories_controller_1.default.updateSubCategory);
router.delete('/:id([0-9]+)', [], sub_categories_controller_1.default.deleteSubCategory);
exports.default = router;
//# sourceMappingURL=sub-categories.routes.js.map