import { Status } from '../../enums';

export class SellerViewListModel {

  id: number;
  user_id: number;
  status: Status;
  name: string;
  subscription_plan_id: number;
  subscription_start_date: Date;
  subscription_end_date: Date;
  address: string;
  landmark: string;
  pincode: string;
  email: string;
  phone: string;
  aadhar_card_no: string;
  pan_card_no: string;
  bank_name: string;
  bank_ac_no: string;
  branch_name: string;
  ifsc_code: string;
  image: string;
  star_rate;
  product_id: number;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
}