import { Length, IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { UserDTO } from '..';

export class AddUserDTO extends UserDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}