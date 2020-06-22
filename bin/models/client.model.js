"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityMapping = exports.ClientModel = void 0;
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
}
exports.ClientModel = ClientModel;
function entityMapping(entity, clientModel) {
    entity.name = clientModel === null || clientModel === void 0 ? void 0 : clientModel.name;
    entity.address = clientModel === null || clientModel === void 0 ? void 0 : clientModel.address;
    entity.landmark = clientModel === null || clientModel === void 0 ? void 0 : clientModel.landmark;
    entity.pin_code = clientModel === null || clientModel === void 0 ? void 0 : clientModel.pin_code;
    entity.email = clientModel === null || clientModel === void 0 ? void 0 : clientModel.email;
    entity.status = clientModel === null || clientModel === void 0 ? void 0 : clientModel.status;
    entity.phone = clientModel === null || clientModel === void 0 ? void 0 : clientModel.phone;
    entity.inserted_by = clientModel === null || clientModel === void 0 ? void 0 : clientModel.inserted_by;
    entity.updated_by = clientModel === null || clientModel === void 0 ? void 0 : clientModel.updated_by;
    return entity;
}
exports.entityMapping = entityMapping;
//# sourceMappingURL=client.model.js.map