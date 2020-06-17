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
}



