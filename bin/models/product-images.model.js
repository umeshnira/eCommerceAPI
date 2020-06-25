"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImagesModel = void 0;
const entity_1 = require("../entity");
class ProductImagesModel {
    getMappedEntity(model) {
        const entity = new entity_1.ProductImages();
        entity.image = model === null || model === void 0 ? void 0 : model.image;
        entity.inserted_at = model === null || model === void 0 ? void 0 : model.inserted_at;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_at = model === null || model === void 0 ? void 0 : model.updated_at;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.ProductImagesModel = ProductImagesModel;
//# sourceMappingURL=product-images.model.js.map