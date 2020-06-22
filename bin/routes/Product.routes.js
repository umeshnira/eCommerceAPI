"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_controller_1 = __importDefault(require("../controllers/Product.controller"));
const router = express_1.Router();
// Create a new product category
router.post('/products', [], Product_controller_1.default.createProduct);
// List categories
router.get('/products', [], Product_controller_1.default.getAllProducts);
router.get('/products/:id([0-9]+)', [], Product_controller_1.default.getProduct);
router.put('/products/:id([0-9]+)', [], Product_controller_1.default.updateProduct);
router.delete('/products/:id([0-9]+)', [], Product_controller_1.default.deleteProduct);
router.get('/products/:id([0-9]+)', [], Product_controller_1.default.getAllProductAganistCategoryId);
exports.default = router;
//# sourceMappingURL=Product.routes.js.map