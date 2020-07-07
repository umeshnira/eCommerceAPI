import { Length, IsNotEmpty, MaxLength } from 'class-validator';
import { IsNotBlank } from '../validators/not-blank.validator';

export class AddCategoryDTO {

    @IsNotEmpty()
    @MaxLength(255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    description: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}