import { Clients } from "../entity";

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
    inserted_by: string = '';
    updated_by: string = '';

   

  }

  export function entityMapping(entity: Clients,clientModel:ClientModel) {

    entity.name =  clientModel?.name;
    entity.address = clientModel?.address;
    entity.landmark = clientModel?.landmark;
    entity.pin_code = clientModel?.pin_code;
    entity.email = clientModel?.email;
    entity.status = clientModel?.status;
    entity.phone = clientModel?.phone;
    entity.inserted_by= clientModel?.inserted_by;
    entity.updated_by = clientModel?.updated_by;
  
    return entity;
  
  }
  