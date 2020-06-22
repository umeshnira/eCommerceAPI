"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerModel = void 0;
const entity_1 = require("../entity");
class SellerModel {
    constructor() {
        this.id = 0;
        this.name = '';
        this.address = '';
        this.landmark = '';
        this.pincode = '';
        this.email = '';
        this.status = false;
        this.phone = '';
        this.aadhar_card_no = '';
        this.pan_card_no = '';
        this.bank_ac_no = '';
        this.ifsc_code = '';
        this.inserted_by = '';
        this.updated_by = '';
    }
    getMappedEntity(model) {
        const entity = new entity_1.Sellers();
        entity.name = model === null || model === void 0 ? void 0 : model.name;
        entity.address = model === null || model === void 0 ? void 0 : model.address;
        entity.landmark = model === null || model === void 0 ? void 0 : model.landmark;
        entity.pincode = model === null || model === void 0 ? void 0 : model.pincode;
        entity.email = model === null || model === void 0 ? void 0 : model.email;
        entity.status = model === null || model === void 0 ? void 0 : model.status;
        entity.phone = model === null || model === void 0 ? void 0 : model.phone;
        entity.aadhar_card_no = model === null || model === void 0 ? void 0 : model.aadhar_card_no;
        entity.pan_card_no = model === null || model === void 0 ? void 0 : model.pan_card_no;
        entity.bank_ac_no = model === null || model === void 0 ? void 0 : model.bank_ac_no;
        entity.ifsc_code = model === null || model === void 0 ? void 0 : model.ifsc_code;
        entity.inserted_by = model === null || model === void 0 ? void 0 : model.inserted_by;
        entity.updated_by = model === null || model === void 0 ? void 0 : model.updated_by;
        return entity;
    }
}
exports.SellerModel = SellerModel;
//# sourceMappingURL=seller.model.js.map