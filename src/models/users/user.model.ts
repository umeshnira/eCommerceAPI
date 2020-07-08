import { UserRole, Status } from '../../enums';

export class UserModel {
    id: number;
    user_name: string;
    password: string;
    status: Status;
    role: UserRole;
    last_logged_in: Date;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}



