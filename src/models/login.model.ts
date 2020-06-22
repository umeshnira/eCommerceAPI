import { UserRole } from "../enums";
import { Login } from "../entity";

export class LoginModel {
    id: number;
    user_id: number = 0;
    user_name: string = '';
    password: string;
    role: UserRole;
    status: boolean;
    inserted_by: string = '';
    updated_by: string = '';

    getMappedEntity(model: any) {
        const entity = new Login();
        entity.user_name = model?.email;
        entity.password = model?.password;
        entity.role = model?.role ? model.role : 'Client';
        entity.inserted_by = model?.inserted_by;
        entity.updated_by = model?.updated_by;

        return entity;
    }
}



