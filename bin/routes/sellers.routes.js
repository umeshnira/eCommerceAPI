"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sellers_controller_1 = __importDefault(require("../controllers/sellers.controller"));
const router = express_1.Router();
router.get('/sellers', [], sellers_controller_1.default.getAllSellers);
router.get('/sellers/:id([0-9]+)', [], sellers_controller_1.default.getSeller);
// Create a new seller
router.post('/sellers', [], sellers_controller_1.default.createSeller);
router.delete('/sellers/:id([0-9]+)', [], sellers_controller_1.default.deleteSeller);
router.put('/sellers/:id([0-9]+)', [], sellers_controller_1.default.updateSeller);
exports.default = router;
//# sourceMappingURL=sellers.routes.js.map