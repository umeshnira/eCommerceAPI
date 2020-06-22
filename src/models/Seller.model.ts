import { UserRole, Sellers } from "../entity";

export class SellerModel {

  id: number = 0;
  name: string = '';
  address: string = '';
  landmark: string = '';
  pincode: string = '';
  email: string = '';
  status: boolean = false;
  phone: string = '';
  role: UserRole;
  aadhar_card_no: string = '';
  pan_card_no: string = '';
  bank_ac_no: string = '';
  ifsc_code: string = '';
  inserted_by: string = '';
  updated_by: string = '';
}


export function modelParsing(entityModel: Sellers, model: SellerModel) {

  entityModel.name = model?.name;
  entityModel.address = model?.address;
  entityModel.landmark = model?.landmark;
  entityModel.pincode = model?.pincode;
  entityModel.email = model?.email;
  entityModel.status = model?.status;
  entityModel.phone = model?.phone;
  entityModel.aadhar_card_no = model?.aadhar_card_no;
  entityModel.pan_card_no = model?.pan_card_no;
  entityModel.bank_ac_no = model?.bank_ac_no;
  entityModel.ifsc_code = model?.ifsc_code;
  entityModel.inserted_by = model?.inserted_by;
  entityModel.updated_by = model?.updated_by;

  return entityModel;

}