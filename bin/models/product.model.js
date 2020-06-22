"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const entity_1 = require("../entity");
class ProductModel {
    getMappedEntity(model) {
        const entity = new entity_1.Products();
        entity.name = model === null || model === void 0 ? void 0 : model.name;
        entity.description = model === null || model === void 0 ? void 0 : model.description;
        entity.batch_no = model === null || model === void 0 ? void 0 : model.batch_no;
        entity.exp_date = model === null || model === void 0 ? void 0 : model.exp_date;
        entity.bar_code = model === null || model === void 0 ? void 0 : model.bar_code;
        entity.about = model === null || model === void 0 ? void 0 : model.about;
        entity.status = model === null || model === void 0 ? void 0 : model.status;
        entity.star_rate = model === null || model === void 0 ? void 0 : model.star_rate;
        entity.is_returnable = model === null || model === void 0 ? void 0 : model.is_returnable;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.ProductModel = ProductModel;
//# sourceMappingURL=product.model.js.map