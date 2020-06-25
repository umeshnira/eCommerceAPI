"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_controller_1 = __importDefault(require("../controllers/Product.controller"));
const image_upload_1 = __importDefault(require("../utils/image-upload"));
const app_settings_json_1 = __importDefault(require("../config/app-settings.json"));
const middlewares_1 = require("../middlewares");
const router = express_1.Router();
router.get('/products', [], Product_controller_1.default.getProducts);
router.get('/products/:id([0-9]+)', [], Product_controller_1.default.getProduct);
router.get('/categories/:id([0-9]+)/products/:id([0-9]+)', [], Product_controller_1.default.getProductsByCategoryId);
router.post('/products', [], middlewares_1.setUploadPath(app_settings_json_1.default.application.storage.product), image_upload_1.default.array('image'), Product_controller_1.default.createProduct);
router.put('/products/:id([0-9]+)', [], image_upload_1.default.array('image'), Product_controller_1.default.updateProduct);
router.delete('/products/:id([0-9]+)', [], Product_controller_1.default.deleteProduct);
exports.default = router;
//# sourceMappingURL=Product.routes.js.map