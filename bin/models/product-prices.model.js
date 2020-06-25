"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPricesModel = void 0;
const entity_1 = require("../entity");
class ProductPricesModel {
    getMappedEntity(model) {
        const entity = new entity_1.ProductPrices();
        entity.price = model === null || model === void 0 ? void 0 : model.price;
        entity.price_without_offer = model === null || model === void 0 ? void 0 : model.price_without_offer;
        entity.inserted_at = model === null || model === void 0 ? void 0 : model.inserted_at;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_at = model === null || model === void 0 ? void 0 : model.updated_at;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.ProductPricesModel = ProductPricesModel;
//# sourceMappingURL=product-prices.model.js.map