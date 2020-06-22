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
ClientsController.getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientRepository = typeorm_1.getRepository(entity_1.Clients);
        const clients = yield clientRepository.createQueryBuilder("clients").getMany();
        if (clients) {
            res.status(200).json(clients);
        }
        else {
            res.status(404).send('Clients Not Found');
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
            res.status(404).send('Client Not Found');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
ClientsController.createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientModel = req.body;
    const loginModel = req.body;
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
        const client = new models_1.ClientModel().getMappedEntity(clientModel);
        const login = new models_1.LoginModel().getMappedEntity(loginModel);
        const result = yield queryRunner.manager.save(client);
        if (result) {
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
ClientsController.updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    const clientModel = req.body;
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
        yield queryRunner.manager.findOneOrFail(clientId);
    }
    catch (error) {
        res.status(404).send('Client not found');
        return;
    }
    try {
        const client = new models_1.ClientModel().getMappedEntity(clientModel);
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .update(entity_1.Clients)
            .set(client)
            .where("id = :id", { id: clientId })
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
    res.status(204).send("Updated Client");
});
ClientsController.deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    const connection = typeorm_1.getConnection();
    const queryRunner = connection.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        yield queryRunner.manager.findOneOrFail(clientId);
    }
    catch (error) {
        res.status(404).send('Resource not found');
        return;
    }
    try {
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.Clients)
            .where("id = :id", { id: clientId })
            .execute();
        yield queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(entity_1.Login)
            .where("user_id = :id", { id: clientId })
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
    res.status(204).send('Deleted Client');
});
exports.default = ClientsController;
//# sourceMappingURL=clients.controller.js.map