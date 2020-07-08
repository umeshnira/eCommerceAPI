import { Length, IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { ClientDTO } from '..';

export class AddClientDTO extends ClientDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}