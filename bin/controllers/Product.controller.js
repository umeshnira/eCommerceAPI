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
class ProductController {
}
// Apis of products
ProductController.getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productRepository = typeorm_1.getRepository(entity_1.Products);
        const products = yield productRepository.createQueryBuilder("products").getMany();
        if (products) {
            res.status(200).json(products);
        }
        else {
            res.status(404).send('Products Not Found');
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
            res.status(404).send('Product Not Found');
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
ProductController.createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productModel = req.body;
    const productCategoryModel = req.body;
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
        const product = yield new models_1.ProductModel().getMappedEntity(productModel);
        const productCategory = yield new models_1.ProductCategoryModel().getMappedEntity(productCategoryModel);
        productCategory.products = product;
        const result = yield queryRunner.manager.save(product);
        yield queryRunner.manager.save(productCategory);
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
ProductController.updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productModel = req.body;
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
        yield queryRunner.manager.findOneOrFail(productId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        const product = yield new models_1.ProductModel().getMappedEntity(productModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.Products)
            .set(product)
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
    res.status(204).send("Updated Product");
});
ProductController.deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield queryRunner.manager.findOneOrFail(productId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductCategories)
            .where("product_id = :id", { id: productId })
            .execute();
        yield queryRunner.manager.connection
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
    res.status(204).send('Deleted Product');
});
exports.default = ProductController;
//# sourceMappingURL=Product.controller.js.map