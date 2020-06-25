"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const entity_1 = require("../entity");
const models_1 = require("../models");
const category_list_model_1 = require("../models/category-list.model");
class SubCategoriesController {
    static processCategoryHierarchy(categories, subCategory) {
        const category = categories.find(x => x.id === subCategory.parent_category_id);
        if (category) {
            if (category.subCategories.findIndex(x => x.id === subCategory.id) === -1) {
                category.subCategories.push(new category_list_model_1.CategoryListModel(subCategory.id, subCategory.name, subCategory.inserted_at, subCategory.inserted_by, subCategory.parent_category_id));
                return true;
            }
        }
        else {
            for (const cat of categories) {
                const hasSubCategoryAdded = this.processCategoryHierarchy(cat.subCategories, subCategory);
                if (hasSubCategoryAdded) {
                    break;
                }
                ;
            }
        }
    }
}
// Apis of categories
SubCategoriesController.getSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const categoryId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const categoryRepository = typeorm_1.getRepository(entity_1.Categories);
        const subCategory = yield categoryRepository.createQueryBuilder()
            .select("category")
            .from(entity_1.Categories, "category")
            .where("category.id = :id", { id: categoryId })
            .getOne();
        if (subCategory) {
            res.status(200).json(subCategory);
        }
        else {
            res.status(404).send('Category Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
SubCategoriesController.getSubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    try {
        const categoriesArray = yield queryRunner.query(`SELECT id,name,inserted_by,inserted_at,parent_category_id
                FROM Categories;`);
        const categories = new Array();
        const mainCategories = categoriesArray.filter(x => x.parent_category_id === null);
        for (const mainCategory of mainCategories) {
            categories.push(new category_list_model_1.CategoryListModel(mainCategory.id, mainCategory.name, mainCategory.inserted_at, mainCategory.inserted_by));
        }
        const subCategories = categoriesArray.filter(x => x.parent_category_id !== null);
        for (const subCategory of subCategories) {
            SubCategoriesController.processCategoryHierarchy(categories, subCategory);
        }
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
SubCategoriesController.getAllSubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parentCategoryRepository = typeorm_1.getRepository(entity_1.Categories);
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    try {
        const categories = yield queryRunner.query(`WITH RECURSIVE category_path (id, name,parent_category_id,inserted_by, inserted_at, path) AS
                (
                SELECT id, name,parent_category_id,inserted_by, inserted_at, name as path
                    FROM categories
                    WHERE parent_category_id IS Not NULL
                UNION ALL
                SELECT c.id, c.name,c.parent_category_id,c.inserted_by, c.inserted_at, CONCAT(cp.path, ' > ', c.name)
                    FROM category_path AS cp JOIN categories AS c
                    ON cp.id = c.parent_category_id
                )
                SELECT * FROM category_path
                ORDER BY path;`);
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
SubCategoriesController.getsubCategoriesByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    try {
        const categories = yield queryRunner.query(`WITH RECURSIVE category_path (id, name,parent_category_id) AS
                (
                SELECT id, name,parent_category_id
                    FROM categories
                    WHERE parent_category_id = ${categoryId}
                UNION ALL
                SELECT c.id, c.name,c.parent_category_id
                    FROM category_path AS cp JOIN categories AS c
                    ON cp.id = c.parent_category_id
                )
                SELECT * FROM category_path
                ORDER BY parent_category_id;`);
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
SubCategoriesController.createSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryModel = req.body;
    if (categoryModel.parent_category_id) {
        const errors = yield class_validator_1.validate(categoryModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
    }
    else {
        res.status(400).send('Parent Id is required');
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        const category = new models_1.CategoryModel().getMappedEntity(categoryModel);
        yield queryRunner.manager.save(category);
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
    res.status(204).send('SubCategory created');
});
SubCategoriesController.updateSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = req.body;
    const categoryId = req.params.id;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield queryRunner.manager.getRepository(entity_1.Categories).findOneOrFail(categoryId);
    }
    catch (error) {
        res.status(404).send('Category not found');
        return;
    }
    try {
        const result = yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.Categories)
            .set({
            name: model.name,
            description: model.description
        })
            .where("id = :id", { id: categoryId })
            .execute();
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
    res.status(201).send('Updated category');
});
SubCategoriesController.deleteSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield queryRunner.manager.getRepository(entity_1.Categories).findOneOrFail(categoryId);
    }
    catch (error) {
        res.status(404).send('Category not found');
        return;
    }
    try {
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.Categories)
            .where("id = :id", { id: categoryId })
            .execute();
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
    res.status(204).send('Deleted Category');
});
exports.default = SubCategoriesController;
//# sourceMappingURL=sub-categories.controller.js.map