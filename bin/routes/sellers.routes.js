"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sellers_controller_1 = __importDefault(require("../controllers/sellers.controller"));
const router = express_1.Router();
// Create a new client
router.post('/', [], sellers_controller_1.default.createSeller);
router.get('/', [], sellers_controller_1.default.getAllSellers);
router.get('/:id([0-9]+)', [], sellers_controller_1.default.getSeller);
router.delete('/:id([0-9]+)', [], sellers_controller_1.default.deleteSeller);
router.put('/:id([0-9]+)', [], sellers_controller_1.default.updateSeller);
exports.default = router;
//# sourceMappingURL=sellers.routes.js.map