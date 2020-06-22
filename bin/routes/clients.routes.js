"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clients_controller_1 = __importDefault(require("../controllers/clients.controller"));
const router = express_1.Router();
router.get('/clients', [], clients_controller_1.default.getAllClients);
router.get('/clients/:id([0-9]+)', [], clients_controller_1.default.getClient);
// Create a new client
router.post('/clients', [], clients_controller_1.default.createClient);
router.put('/clients/:id([0-9]+)', [], clients_controller_1.default.updateClient);
router.delete('/clients/:id([0-9]+)', [], clients_controller_1.default.deleteClient);
exports.default = router;
//# sourceMappingURL=clients.routes.js.map