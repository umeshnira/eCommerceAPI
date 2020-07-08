import { CartDTO } from '..';
import { IsNotEmpty, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class UpdateCartDTO extends CartDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string
}