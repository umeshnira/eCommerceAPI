import { IsNotEmpty, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { SaveLaterDTO } from '..';

export class UpdateSaveLaterDTO extends SaveLaterDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string
}