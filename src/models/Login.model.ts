import { UserRole } from "../entity";

export class LoginModel {
    id: number;
    user_id: number=0;
    user_name: string='';
    password: string;
    role: UserRole;
    status: boolean;
    inserted_by: string='';
    updated_by: string='';

    // entityMapping = (entity) => {

    //     entity.name =  this?.name;
    //     entity.address = this?.address;
    //     entity.landmark = this?.landmark;
    //     entity.pin_code = this?.pin_code;
    //     entity.user_name = this?.email;
    //     entity.status = this?.status;
    //     entity.phone = this?.phone;
    //     entity.role = this?.role;
    //     entity.inserted_by= this?.inserted_by;
    //     entity.updated_by = this?.updated_by;
      
    //     return entity;
      
    //   }
}



