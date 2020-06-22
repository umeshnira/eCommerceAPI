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
class ProductController {
}
// Apis of products
ProductController.createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productModel = req.body;
    const productCategoryModel = req.body;
    const productRepository = typeorm_1.getRepository(entity_1.Products);
    const productCategoryRepository = typeorm_1.getRepository(entity_1.ProductCategories);
    const product = new entity_1.Products();
    const productCategory = new entity_1.ProductCategories();
    const errors = yield class_validator_1.validate(productModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield ProductController.modelMapping(productModel, product);
        const result = yield productRepository.save(product);
        productCategory.products = product;
        productCategory.category = productCategoryModel === null || productCategoryModel === void 0 ? void 0 : productCategoryModel.category_id;
        productCategory.inserted_by = productCategoryModel === null || productCategoryModel === void 0 ? void 0 : productCategoryModel.inserted_by;
        yield productCategoryRepository.save(productCategory);
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
    res.status(201).send('Product created');
});
ProductController.getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productRepository = typeorm_1.getRepository(entity_1.Products);
        const products = yield productRepository.createQueryBuilder("products").getMany();
        if (products) {
            res.status(200).json(products);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
ProductController.getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const productRepository = typeorm_1.getRepository(entity_1.Products);
        const product = yield productRepository.createQueryBuilder()
            .select("product")
            .from(entity_1.Products, "product")
            .where("product.id = :id", { id: productId })
            .getOne();
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
ProductController.getAllProductAganistCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    const productRepository = typeorm_1.getRepository(entity_1.Products);
    try {
        const products = yield productRepository
            .find({
            select: ['id', 'name', 'description'],
            where: { category_id: categoryId }
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
ProductController.updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productModel = req.body;
    const product = new entity_1.Products();
    const productRepository = typeorm_1.getRepository(entity_1.Products);
    const errors = yield class_validator_1.validate(productModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    try {
        yield productRepository.findOneOrFail(productId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        const model = yield ProductController.modelMapping(productModel, product);
        yield productRepository
            .createQueryBuilder()
            .update(entity_1.Products)
            .set(model)
            .where("id = :id", { id: productId })
            .execute();
        res.status(201).send("Updated Product");
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
});
ProductController.deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productRepository = typeorm_1.getRepository(entity_1.Products);
    let product;
    try {
        product = yield productRepository.findOneOrFail(productId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductCategories)
            .where("product_id = :id", { id: productId })
            .execute();
        yield typeorm_1.getConnection()
            .createQueryBuilder()
            .delete()
            .from(entity_1.Products)
            .where("id = :id", { id: productId })
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
    res.status(201).send('Deleted Product');
});
ProductController.modelMapping = (model, entityModel) => __awaiter(void 0, void 0, void 0, function* () {
    if (entityModel instanceof entity_1.Products) {
        entityModel.name = model === null || model === void 0 ? void 0 : model.name;
        entityModel.description = model === null || model === void 0 ? void 0 : model.description;
        entityModel.batch_no = model === null || model === void 0 ? void 0 : model.batch_no;
        entityModel.exp_date = model === null || model === void 0 ? void 0 : model.exp_date;
        entityModel.bar_code = model === null || model === void 0 ? void 0 : model.bar_code;
        entityModel.about = model === null || model === void 0 ? void 0 : model.about;
        entityModel.status = model === null || model === void 0 ? void 0 : model.status;
        entityModel.star_rate = model === null || model === void 0 ? void 0 : model.star_rate;
        entityModel.is_returnable = model === null || model === void 0 ? void 0 : model.is_returnable;
        entityModel.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entityModel.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
    }
    return entityModel;
});
exports.default = ProductController;
//# sourceMappingURL=Product.controller.js.map