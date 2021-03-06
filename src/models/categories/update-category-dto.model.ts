import { Length, IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { CategoryDTO } from '..';

export class UpdateCategoryDTO extends CategoryDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string;
}