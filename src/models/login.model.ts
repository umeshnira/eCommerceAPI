import { UserRole } from "../enums";
import { Login } from "../entity";

export class LoginModel {
    id: number;
    user_id: number = 0;
    user_name: string = '';
    password: string;
    role: number;
    status: boolean;
    created_by: string = '';
    updated_by: string = '';
    email: string = '';

    getMappedEntity(model: this) {
        const entity = new Login();
        entity.user_name = model?.email;
        entity.password = model?.password;
        entity.roles = model?.role ;
        entity.created_by = model?.created_by;
        entity.updated_by = model?.updated_by;

        return entity;
    }
}



