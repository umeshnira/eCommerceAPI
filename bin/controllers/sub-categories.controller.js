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
class SubCategoriesController {
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
            res.status(404).send('Resource Not Found');
        }
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
        yield queryRunner.manager.findOneOrFail(categoryId);
    }
    catch (error) {
        res.status(404).send('Category not found');
        return;
    }
    try {
        const result = yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.Categories)
            .set({ name: model.name })
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
        yield queryRunner.manager.findOneOrFail(categoryId);
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