import { Length, IsNotEmpty, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { CategoryDTO } from '..';

export class AddCategoryDTO extends CategoryDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}