import { UserRole } from "../entity";

export class SellerModel {

  id: number = 0;
  name: string = '';
  address: string = '';
  landmark: string = '';
  pin_code: string = '';
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
