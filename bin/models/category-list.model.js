"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryListModel = void 0;
class CategoryListModel {
    constructor(id, name, inserted_at, inserted_by, parent_category_id) {
        this.subCategories = [];
        this.id = id;
        this.name = name;
        this.inserted_by = inserted_by;
        this.inserted_at = inserted_at;
        this.parent_category_id = parent_category_id;
    }
}
exports.CategoryListModel = CategoryListModel;
//# sourceMappingURL=category-list.model.js.map