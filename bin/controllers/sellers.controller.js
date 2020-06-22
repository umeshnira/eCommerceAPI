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
class SellersController {
}
SellersController.createSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerModel = req.body;
    const loginModel = req.body;
    // client.hashPassword();
    if (sellerModel.role === 'Seller') {
        const errors = yield class_validator_1.validate(sellerModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const seller = new entity_1.Sellers();
        const sellerRepository = typeorm_1.getRepository(entity_1.Sellers);
        const login = new entity_1.Login();
        const loginRepository = typeorm_1.getRepository(entity_1.Login);
        const connection = typeorm_1.getConnection();
        const queryRunner = connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            // await entityParsing(seller, sellerModel);
            yield SellersController.modelMapping(sellerModel, seller);
            const result = yield sellerRepository.save(seller);
            if (result) {
                yield SellersController.modelMapping(loginModel, login);
                login.user_id = result.id;
                const loginResult = yield loginRepository.save(login);
                res.status(201).send('Seller created');
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
    }
});
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
SellersController.deleteSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.params.id;
    const sellerRepository = typeorm_1.getRepository(entity_1.Sellers);
    const loginRepository = typeorm_1.getRepository(entity_1.Login);
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield sellerRepository.findOneOrFail(sellerId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        yield sellerRepository.createQueryBuilder()
            .delete()
            .from(entity_1.Sellers)
            .where("id = :id", { id: sellerId })
            .execute();
        yield loginRepository.createQueryBuilder()
            .delete()
            .from(entity_1.Login)
            .where("user_id = :id", { id: sellerId })
            .execute();
        res.status(201).send('Deleted Seller');
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
SellersController.updateSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerId = req.params.id;
    const sellerModel = req.body;
    const seller = new entity_1.Sellers();
    const sellerRepository = typeorm_1.getRepository(entity_1.Sellers);
    const errors = yield class_validator_1.validate(sellerModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    try {
        yield sellerRepository.findOneOrFail(sellerId);
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
        const model = SellersController.modelMapping(sellerModel, seller);
        yield sellerRepository
            .createQueryBuilder()
            .update(entity_1.Sellers)
            .set(model)
            .where("id = :id", { id: sellerId })
            .execute();
        res.status(201).send("Updated Seller");
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
SellersController.modelMapping = (model, entityModel) => {
    if (entityModel instanceof entity_1.Sellers) {
        entityModel.name = model === null || model === void 0 ? void 0 : model.name;
        entityModel.address = model === null || model === void 0 ? void 0 : model.address;
        entityModel.landmark = model === null || model === void 0 ? void 0 : model.landmark;
        entityModel.pincode = model === null || model === void 0 ? void 0 : model.pincode;
        entityModel.email = model === null || model === void 0 ? void 0 : model.email;
        entityModel.status = model === null || model === void 0 ? void 0 : model.status;
        entityModel.phone = model === null || model === void 0 ? void 0 : model.phone;
        entityModel.aadhar_card_no = model === null || model === void 0 ? void 0 : model.aadhar_card_no;
        entityModel.pan_card_no = model === null || model === void 0 ? void 0 : model.pan_card_no;
        entityModel.bank_ac_no = model === null || model === void 0 ? void 0 : model.bank_ac_no;
        entityModel.ifsc_code = model === null || model === void 0 ? void 0 : model.ifsc_code;
        entityModel.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entityModel.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
    }
    if (entityModel instanceof entity_1.Login) {
        entityModel.user_name = model === null || model === void 0 ? void 0 : model.email;
        entityModel.password = model === null || model === void 0 ? void 0 : model.password;
        entityModel.role = (model === null || model === void 0 ? void 0 : model.role) ? model.role : 'Seller';
        entityModel.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entityModel.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
    }
    return entityModel;
};
exports.default = SellersController;
//# sourceMappingURL=sellers.controller.js.map