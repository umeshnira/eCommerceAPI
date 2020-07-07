import { Clients } from '../entity';

export class ClientModel {

  id: number = 0;
  name: string = '';
  address: string = '';
  landmark: string = '';
  pin_code: string = '';
  email: string = '';
  status: boolean = false;
  phone: string = '';
  role: string = '';
  created_by: string = '';
  updated_by: string = '';

  getMappedEntity(model: this) {
    const entity = new Clients()
    entity.name = model?.name;
    entity.address = model?.address;
    entity.landmark = model?.landmark;
    entity.pin_code = model?.pin_code;
    entity.email = model?.email;
    entity.phone = model?.phone;
    entity.created_by = model?.created_by;
    entity.updated_by = model?.updated_by;

    return entity;
  }
}
