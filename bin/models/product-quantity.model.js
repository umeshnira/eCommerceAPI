"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuantityModel = void 0;
const entity_1 = require("../entity");
class ProductQuantityModel {
    getMappedEntity(model) {
        const entity = new entity_1.ProductQuantity();
        entity.left_qty = model === null || model === void 0 ? void 0 : model.left_qty;
        entity.tota_qty = model === null || model === void 0 ? void 0 : model.tota_qty;
        entity.inserted_at = model === null || model === void 0 ? void 0 : model.inserted_at;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_at = model === null || model === void 0 ? void 0 : model.updated_at;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.ProductQuantityModel = ProductQuantityModel;
//# sourceMappingURL=product-quantity.model.js.map