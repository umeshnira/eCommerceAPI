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
const models_1 = require("../models");
const entity_1 = require("../entity");
class SellersController {
}
SellersController.getAllSellers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerRepository = typeorm_1.getRepository(entity_1.Sellers);
        const sellers = yield sellerRepository.createQueryBuilder("sellers").getMany();
        if (sellers) {
            res.status(200).json(sellers);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
SellersController.getSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sellerId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const sellerRepository = typeorm_1.getRepository(entity_1.Sellers);
        const seller = yield sellerRepository.createQueryBuilder()
            .select("seller")
            .from(entity_1.Sellers, "seller")
            .where("seller.id = :id", { id: sellerId })
            .getOne();
        if (seller) {
            res.status(200).json(seller);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
SellersController.createSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerModel = req.body;
    const loginModel = req.body;
    const errors = yield class_validator_1.validate(sellerModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        const seller = yield new models_1.SellerModel().getMappedEntity(sellerModel);
        const result = yield queryRunner.manager.save(seller);
        if (result) {
            const login = yield new models_1.LoginModel().getMappedEntity(loginModel);
            login.user_id = result.id;
            const loginResult = yield queryRunner.manager.save(login);
            yield queryRunner.commitTransaction();
        }
        else {
            res.status(409).send('username already exists');
        }
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        res.status(500).send(error.message);
    }
    finally {
        yield queryRunner.release();
    }
    res.status(201).send('Seller created');
});
SellersController.updateSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.params.id;
    const sellerModel = req.body;
    const errors = yield class_validator_1.validate(sellerModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield queryRunner.manager.findOneOrFail(sellerId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        const seller = yield new models_1.SellerModel().getMappedEntity(sellerModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.Sellers)
            .set(seller)
            .where("id = :id", { id: sellerId })
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
    res.status(204).send("Updated Seller");
});
SellersController.deleteSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.params.id;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield queryRunner.manager.findOneOrFail(sellerId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.Sellers)
            .where("id = :id", { id: sellerId })
            .execute();
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.Login)
            .where("user_id = :id", { id: sellerId })
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
    res.status(204).send('Deleted Seller');
});
exports.default = SellersController;
//# sourceMappingURL=sellers.controller.js.map