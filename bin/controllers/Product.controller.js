"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
class ProductController {
    static unlinkUploadedFiles(files) {
        if (files) {
            for (const file of files) {
                fs.unlink(file.path, function (err) {
                    if (err)
                        throw err;
                });
            }
        }
    }
}
ProductController.getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        yield queryRunner.connect();
        const result = yield queryRunner.manager.connection
            .createQueryBuilder(entity_1.Products, 'p')
            .addSelect('p.id', 'id')
            .addSelect('p.name', 'name')
            .addSelect('p.description', 'description')
            .addSelect('p.star_rate', 'star_rate')
            .addSelect('pp.price', 'price')
            .innerJoin(entity_1.ProductPrices, 'pp', 'pp.product_id = p.id')
            .innerJoin(entity_1.ProductImages, 'pi', 'pi.product_id = p.id')
            .getRawMany();
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(404).send('Products not found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
});
ProductController.getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        const productId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        yield queryRunner.connect();
        const result = yield queryRunner.manager.connection
            .createQueryBuilder(entity_1.Products, 'p')
            .addSelect('p.id', 'id')
            .addSelect('p.name', 'name')
            .addSelect('p.description', 'description')
            .addSelect('p.star_rate', 'star_rate')
            .addSelect('pp.price', 'price')
            .addSelect('p.batch_no', 'batch_no')
            .addSelect('p.exp_date', 'exp_date')
            .addSelect('p.bar_code', 'bar_code')
            .addSelect('pp.price', 'price')
            .addSelect('pp.price_without_offer', 'price_without_offer')
            .addSelect('po.offer_id', 'offer_id')
            .addSelect('pq.left_qty', 'left_qty')
            .addSelect('pq.tota_qty', 'tota_qty')
            .addSelect('pc.category_id', 'category_id')
            .addSelect('pc.status', 'status')
            .innerJoin(entity_1.ProductPrices, 'pp', 'pp.product_id = p.id')
            .innerJoin(entity_1.ProductOffers, 'po', 'po.product_id = p.id')
            .innerJoin(entity_1.ProductQuantity, 'pq', 'pq.product_id = p.id')
            .innerJoin(entity_1.ProductCategories, 'pc', 'pc.product_id = p.id')
            .innerJoin(entity_1.ProductImages, 'pi', 'pi.product_id = p.id')
            .where("p.id = :id", { id: productId })
            .getRawOne();
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.status(404).send(`Product with id: ${productId}  not found`);
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
});
ProductController.getProductsByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        const categoryId = req.params.id;
        yield queryRunner.connect();
        const category = yield queryRunner.manager.findOneOrFail(categoryId);
        if (!category) {
            res.status(404).send(`Category with id: ${categoryId} not found`);
            return;
        }
        const productRepository = typeorm_1.getRepository(entity_1.Products);
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
    finally {
        yield queryRunner.release();
    }
});
ProductController.createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        const parsedData = JSON.parse(req.body.data);
        const productModel = parsedData;
        const productCategoryModel = parsedData.category;
        const productOffersModel = parsedData.offer;
        const productQuantityModel = parsedData.quantity;
        const productPricesModel = parsedData.price;
        const errors = yield class_validator_1.validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        const product = yield new models_1.ProductModel().getMappedEntity(productModel);
        yield queryRunner.manager.save(product);
        const productCategory = yield new models_1.ProductCategoryModel().getMappedEntity(productCategoryModel);
        productCategory.products = product;
        yield queryRunner.manager.save(productCategory);
        const productQuantity = yield new models_1.ProductQuantityModel().getMappedEntity(productQuantityModel);
        productQuantity.products = product;
        yield queryRunner.manager.save(productQuantity);
        const productPrices = yield new models_1.ProductPricesModel().getMappedEntity(productPricesModel);
        productPrices.products = product;
        yield queryRunner.manager.save(productPrices);
        if (productOffersModel) {
            const productOffers = yield new models_1.ProductOffersModel().getMappedEntity(productOffersModel);
            productOffers.products = product;
            yield queryRunner.manager.save(productOffers);
        }
        for (const file of req === null || req === void 0 ? void 0 : req.files) {
            const productImagesModel = new models_1.ProductImagesModel();
            productImagesModel.image = file.filename;
            productImagesModel.inserted_by = productModel.inserted_by;
            productImagesModel.inserted_at = new Date();
            const productImages = yield new models_1.ProductImagesModel().getMappedEntity(productImagesModel);
            productImages.products = product;
            yield queryRunner.manager.save(productImages);
        }
        yield queryRunner.commitTransaction();
        res.status(201).send('Product created');
    }
    catch (error) {
        ProductController.unlinkUploadedFiles(req === null || req === void 0 ? void 0 : req.files);
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
});
ProductController.updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        const productId = req.params.id;
        const parsedData = JSON.parse(req.body.data);
        const productModel = parsedData;
        const productCategoryModel = parsedData.category;
        const productOffersModel = parsedData.offer;
        const productQuantityModel = parsedData.quantity;
        const productPricesModel = parsedData.price;
        const errors = yield class_validator_1.validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const prod = yield queryRunner.manager.findOneOrFail(productId);
        if (!prod) {
            res.status(404).send(`Product with id: ${productId}  not found`);
            return;
        }
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        const product = yield new models_1.ProductModel().getMappedEntity(productModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.Products)
            .set(product)
            .where("id = :id", { id: productId })
            .execute();
        const productCategory = yield new models_1.ProductCategoryModel().getMappedEntity(productCategoryModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.ProductCategories)
            .set(productCategory)
            .where("product_id = :id", { id: productId })
            .execute();
        if (productOffersModel) {
            const productOffers = yield new models_1.ProductOffersModel().getMappedEntity(productOffersModel);
            yield queryRunner.manager.connection
                .createQueryBuilder()
                .update(entity_1.ProductOffers)
                .set(productOffers)
                .where("product_id = :id", { id: productId })
                .execute();
        }
        const productQuantity = yield new models_1.ProductQuantityModel().getMappedEntity(productQuantityModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.ProductQuantity)
            .set(productQuantity)
            .where("product_id = :id", { id: productId })
            .execute();
        const productPrices = yield new models_1.ProductPricesModel().getMappedEntity(productPricesModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.ProductPrices)
            .set(productPrices)
            .where("product_id = :id", { id: productId })
            .execute();
        for (const file of req === null || req === void 0 ? void 0 : req.files) {
            const productImagesModel = new models_1.ProductImagesModel();
            productImagesModel.image = file.filename;
            productImagesModel.updated_by = productModel.updated_by;
            productImagesModel.updated_at = new Date();
            const productImages = yield new models_1.ProductImagesModel().getMappedEntity(productImagesModel);
            yield queryRunner.manager.connection
                .createQueryBuilder()
                .update(entity_1.ProductImages)
                .set(productImages)
                .where("product_id = :id", { id: productId })
                .execute();
        }
        yield queryRunner.commitTransaction();
        res.status(204).send("Product is upadted");
    }
    catch (error) {
        ProductController.unlinkUploadedFiles(req === null || req === void 0 ? void 0 : req.files);
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
});
ProductController.deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
        const productId = req.params.id;
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        const prod = yield queryRunner.manager.findOneOrFail(productId);
        if (!prod) {
            res.status(404).send(`Product with id: ${productId}  not found`);
            return;
        }
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductCategories)
            .where("product_id = :id", { id: productId })
            .execute();
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductOffers)
            .where("product_id = :id", { id: productId })
            .execute();
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductQuantity)
            .where("product_id = :id", { id: productId })
            .execute();
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductPrices)
            .where("product_id = :id", { id: productId })
            .execute();
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.ProductImages)
            .where("product_id = :id", { id: productId })
            .execute();
        const images = yield typeorm_1.getConnection()
            .createQueryBuilder()
            .select("image")
            .from(entity_1.ProductImages, "image")
            .where("image.product_id = :id", { id: productId })
            .getMany();
        const files = [];
        for (const image of images) {
            files.push({ path: image.image });
        }
        ProductController.unlinkUploadedFiles(files);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.Products)
            .where("id = :id", { id: productId })
            .execute();
        yield queryRunner.commitTransaction();
        res.status(204).send('Product is deleted');
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
});
exports.default = ProductController;
//# sourceMappingURL=Product.controller.js.map