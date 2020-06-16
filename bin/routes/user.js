"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = express_1.Router();
// Get all users
router.get('/', [], UserController_1.default.getAllUsers);
// Get one user
router.get('/:id([0-9]+)', [], UserController_1.default.getUser);
// Create a new user
router.post('/', [], UserController_1.default.createUser);
// Edit one user
router.patch('/:id([0-9]+)', [], UserController_1.default.updateUser);
// Delete one user
router.delete('/:id([0-9]+)', [], UserController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map