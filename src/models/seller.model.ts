import { Sellers } from "../entity";
import { UserRole } from "../enums";

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
  created_by: string = '';
  updated_by: string = '';
  branch_name: string = '';
  bank_name: string = '';

  getMappedEntity(model: SellerModel) {
    const entity = new Sellers()
    entity.name = model?.name;
    entity.address = model?.address;
    entity.landmark = model?.landmark;
    entity.pincode = model?.pincode;
    entity.email = model?.email;
    entity.phone = model?.phone;
    entity.aadhar_card_no = model?.aadhar_card_no;
    entity.pan_card_no = model?.pan_card_no;
    entity.bank_ac_no = model?.bank_ac_no;
    entity.ifsc_code = model?.ifsc_code;
    entity.created_by = model?.created_by;
    entity.updated_by = model?.updated_by;
    entity.branch_name = model?.branch_name;
    entity.bank_name = model?.bank_name;

    return entity;
  }
}