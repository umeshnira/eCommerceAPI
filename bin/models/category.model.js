"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const entity_1 = require("../entity");
class CategoryModel {
    getMappedEntity(model) {
        const entity = new entity_1.Categories();
        entity.name = model === null || model === void 0 ? void 0 : model.name;
        entity.description = model === null || model === void 0 ? void 0 : model.description;
        entity.parent_category_id = model === null || model === void 0 ? void 0 : model.parent_category_id;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        return entity;
    }
}
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=category.model.js.map