"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOffersModel = void 0;
const entity_1 = require("../entity");
class ProductOffersModel {
    getMappedEntity(model) {
        const entity = new entity_1.ProductOffers();
        entity.offer_id = model === null || model === void 0 ? void 0 : model.offer_id;
        entity.inserted_at = model === null || model === void 0 ? void 0 : model.inserted_at;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_at = model === null || model === void 0 ? void 0 : model.updated_at;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.ProductOffersModel = ProductOffersModel;
//# sourceMappingURL=product-offers.model.js.map