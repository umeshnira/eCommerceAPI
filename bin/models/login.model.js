"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModel = void 0;
const entity_1 = require("../entity");
class LoginModel {
    constructor() {
        this.user_id = 0;
        this.user_name = '';
        this.inserted_by = '';
        this.updated_by = '';
    }
    getMappedEntity(model) {
        const entity = new entity_1.Login();
        entity.user_name = model === null || model === void 0 ? void 0 : model.email;
        entity.password = model === null || model === void 0 ? void 0 : model.password;
        entity.role = (model === null || model === void 0 ? void 0 : model.role) ? model.role : 'Client';
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.LoginModel = LoginModel;
//# sourceMappingURL=login.model.js.map