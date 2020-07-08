import { Status } from '../../enums';

export class ClientModel {

  id: number;
  user_id: number;
  status: Status;
  name: string ;
  address: string;
  landmark: string;
  pin_code: string;
  email: string;
  phone: string;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
}
