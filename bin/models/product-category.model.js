"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryModel = void 0;
const entity_1 = require("../entity");
class ProductCategoryModel {
    getMappedEntity(model) {
        const entity = new entity_1.ProductCategories();
        entity.category = model === null || model === void 0 ? void 0 : model.category_id;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        return entity;
    }
}
exports.ProductCategoryModel = ProductCategoryModel;
//# sourceMappingURL=product-category.model.js.map