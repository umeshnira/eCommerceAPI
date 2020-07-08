import { Length, IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { ClientDTO } from './client-dto.model';

export class UpdateClientDTO extends ClientDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string;
}