import { IsNotEmpty, MaxLength, Length, IsInt } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class UserDTO {

    @IsNotEmpty()
    @MaxLength(255)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    user_name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    password: string;

    @IsInt()
    @IsNotEmpty()
    status: number;

    @IsInt()
    @IsNotEmpty()
    role: number;
}