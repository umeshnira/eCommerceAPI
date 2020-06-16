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
exports.CreateAdminUser1547919837483 = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
class CreateAdminUser1547919837483 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.User();
            user.username = "admin";
            user.password = "admin";
            user.hashPassword();
            user.role = "ADMIN";
            const userRepository = typeorm_1.getRepository(User_1.User);
            yield userRepository.save(user);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.CreateAdminUser1547919837483 = CreateAdminUser1547919837483;
//# sourceMappingURL=1591886725984-CreateAdminUser.js.map