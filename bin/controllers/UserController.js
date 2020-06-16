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
const User_1 = require("../entity/User");
class UserController {
}
UserController.getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(User_1.User);
    const users = yield userRepository.find({ select: ['id', 'username', 'role'] });
    res.status(200).send(users);
});
UserController.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        const user = yield userRepository.findOneOrFail(id, { select: ['id', 'username', 'role'] });
        res.status(200).send(user);
    }
    catch (error) {
        res.status(404).send('User not found');
    }
});
UserController.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    const user = new User_1.User();
    user.username = username;
    user.password = password;
    user.role = role;
    const errors = yield class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    user.hashPassword();
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        yield userRepository.save(user);
    }
    catch (e) {
        res.status(409).send('username already in use');
        return;
    }
    res.status(201).send('User created');
});
UserController.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, role } = req.body;
    const userId = req.params.id;
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail(userId);
    }
    catch (error) {
        res.status(404).send('User not found');
        return;
    }
    user.username = username;
    user.username = username;
    user.role = role;
    const errors = yield class_validator_1.validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    try {
        yield userRepository.save(user);
    }
    catch (e) {
        res.status(409).send('username already in use');
        return;
    }
    res.status(204).send();
});
UserController.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const userRepository = typeorm_1.getRepository(User_1.User);
    let user;
    try {
        user = yield userRepository.findOneOrFail(userId);
    }
    catch (error) {
        res.status(404).send('User not found');
        return;
    }
    userRepository.delete(userId);
    res.status(204).send();
});
;
exports.default = UserController;
//# sourceMappingURL=UserController.js.map