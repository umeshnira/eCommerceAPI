"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_routes_1 = __importDefault(require("./categories.routes"));
const Product_routes_1 = __importDefault(require("./Product.routes"));
const sellers_routes_1 = __importDefault(require("./sellers.routes"));
const clients_routes_1 = __importDefault(require("./clients.routes"));
const sub_categories_routes_1 = __importDefault(require("./sub-categories.routes"));
const routes = express_1.Router();
routes.use('/categories', categories_routes_1.default);
routes.use('/subcategories', sub_categories_routes_1.default);
routes.use('/products', Product_routes_1.default);
routes.use('/sellers', sellers_routes_1.default);
routes.use('/clients', clients_routes_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map