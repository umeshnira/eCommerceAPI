"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModel = void 0;
const entity_1 = require("../entity");
class ClientModel {
    constructor() {
        this.id = 0;
        this.name = '';
        this.address = '';
        this.landmark = '';
        this.pin_code = '';
        this.email = '';
        this.status = false;
        this.phone = '';
        this.role = '';
        this.inserted_by = '';
        this.updated_by = '';
    }
    getMappedEntity(model) {
        const entity = new entity_1.Clients();
        entity.name = model === null || model === void 0 ? void 0 : model.name;
        entity.address = model === null || model === void 0 ? void 0 : model.address;
        entity.landmark = model === null || model === void 0 ? void 0 : model.landmark;
        entity.pin_code = model === null || model === void 0 ? void 0 : model.pin_code;
        entity.email = model === null || model === void 0 ? void 0 : model.email;
        entity.status = model === null || model === void 0 ? void 0 : model.status;
        entity.phone = model === null || model === void 0 ? void 0 : model.phone;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.ClientModel = ClientModel;
//# sourceMappingURL=client.model.js.map