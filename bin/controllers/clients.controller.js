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
class ClientsController {
}
ClientsController.createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientModel = req.body;
    const loginModel = req.body;
    const clientRepository = typeorm_1.getRepository(entity_1.Clients);
    const loginRepository = typeorm_1.getRepository(entity_1.Login);
    // client.hashPassword();
    if (clientModel.role === 'Client') {
        const errors = yield class_validator_1.validate(clientModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        const client = new entity_1.Clients();
        const login = new entity_1.Login();
        const connection = typeorm_1.getConnection();
        const queryRunner = connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            yield ClientsController.modelMapping(clientModel, client);
            const result = yield clientRepository.save(client);
            if (result) {
                yield ClientsController.modelMapping(loginModel, login);
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
ClientsController.getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientRepository = typeorm_1.getRepository(entity_1.Clients);
        const clients = yield clientRepository.createQueryBuilder("clients").getMany();
        if (clients) {
            res.status(200).json(clients);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
ClientsController.getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const clientId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const clientRepository = typeorm_1.getRepository(entity_1.Clients);
        const client = yield clientRepository.createQueryBuilder()
            .select("client")
            .from(entity_1.Clients, "client")
            .where("client.id = :id", { id: clientId })
            .getOne();
        if (client) {
            res.status(200).json(client);
        }
        else {
            res.status(404).send('Resource Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
ClientsController.deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    const clientRepository = typeorm_1.getRepository(entity_1.Clients);
    const loginRepository = typeorm_1.getRepository(entity_1.Login);
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield clientRepository.findOneOrFail(clientId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        yield clientRepository.createQueryBuilder()
            .delete()
            .from(entity_1.Clients)
            .where("id = :id", { id: clientId })
            .execute();
        yield loginRepository.createQueryBuilder()
            .delete()
            .from(entity_1.Login)
            .where("user_id = :id", { id: clientId })
            .execute();
        res.status(201).send('Deleted Client');
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
ClientsController.updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    const clientModel = req.body;
    const client = new entity_1.Clients();
    const clientRepository = typeorm_1.getRepository(entity_1.Clients);
    const errors = yield class_validator_1.validate(clientModel);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield clientRepository.findOneOrFail(clientId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        const model = yield models_1.entityMapping(client, clientModel);
        yield clientRepository
            .createQueryBuilder()
            .update(entity_1.Clients)
            .set(model)
            .where("id = :id", { id: clientId })
            .execute();
        res.status(201).send("Updated Client");
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
ClientsController.modelMapping = (model, entityModel) => __awaiter(void 0, void 0, void 0, function* () {
    if (entityModel instanceof entity_1.Clients) {
        entityModel.name = model === null || model === void 0 ? void 0 : model.name;
        entityModel.address = model === null || model === void 0 ? void 0 : model.address;
        entityModel.landmark = model === null || model === void 0 ? void 0 : model.landmark;
        entityModel.pin_code = model === null || model === void 0 ? void 0 : model.pin_code;
        entityModel.email = model === null || model === void 0 ? void 0 : model.email;
        entityModel.status = model === null || model === void 0 ? void 0 : model.status;
        entityModel.phone = model === null || model === void 0 ? void 0 : model.phone;
        entityModel.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entityModel.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
    }
    if (entityModel instanceof entity_1.Login) {
        entityModel.user_name = model === null || model === void 0 ? void 0 : model.email;
        entityModel.password = model === null || model === void 0 ? void 0 : model.password;
        entityModel.role = (model === null || model === void 0 ? void 0 : model.role) ? model.role : 'Client';
        entityModel.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entityModel.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
    }
    return entityModel;
});
exports.default = ClientsController;
//# sourceMappingURL=clients.controller.js.map