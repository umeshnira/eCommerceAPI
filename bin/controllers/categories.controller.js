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
class CategoriesController {
}
// Apis of categories
CategoriesController.getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parentCategoryRepository = typeorm_1.getRepository(entity_1.Categories);
    try {
        const categories = yield parentCategoryRepository
            .find({
            select: ['id', 'name', 'description', 'inserted_by', 'inserted_at'],
            where: { parent_category_id: typeorm_1.IsNull() }
        });
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
CategoriesController.getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const categoryId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const categoryRepository = typeorm_1.getRepository(entity_1.Categories);
        const category = yield categoryRepository.createQueryBuilder()
            .select("category")
            .from(entity_1.Categories, "category")
            .where("category.id = :id", { id: categoryId })
            .getOne();
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
CategoriesController.createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryModel = req.body;
    const category = new entity_1.Categories();
    const errors = yield class_validator_1.validate(categoryModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        category.name = categoryModel === null || categoryModel === void 0 ? void 0 : categoryModel.name;
        category.description = categoryModel === null || categoryModel === void 0 ? void 0 : categoryModel.description;
        category.parent_category_id = categoryModel === null || categoryModel === void 0 ? void 0 : categoryModel.parent_category_id;
        category.inserted_by = categoryModel === null || categoryModel === void 0 ? void 0 : categoryModel.inserted_by;
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
    res.status(201).send('Category created');
});
CategoriesController.updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const model = req.body;
    const categoryId = req.params.id;
    const categoryRepository = typeorm_1.getRepository(entity_1.Categories);
    try {
        yield categoryRepository.findOneOrFail(categoryId);
    }
    catch (error) {
        res.status(404).send('Category not found');
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
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
    res.status(204).send('Updated category');
});
CategoriesController.deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const categoryRepository = typeorm_1.getRepository(entity_1.Categories);
    let category;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        category = yield categoryRepository.findOneOrFail(categoryId);
        console.log(category);
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
        res.status(500).json({ "message": "Categories with sub category cannot be deleted" });
    }
    finally {
        yield queryRunner.release();
    }
    res.status(204).send("Deleted category");
});
exports.default = CategoriesController;
//# sourceMappingURL=categories.controller.js.map