"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelParsing = exports.SellerModel = void 0;
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
}
exports.SellerModel = SellerModel;
function modelParsing(entityModel, model) {
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
    return entityModel;
}
exports.modelParsing = modelParsing;
//# sourceMappingURL=seller.model.js.map