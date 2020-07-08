import { Length, IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { SubCategoryDTO } from '..';

export class UpdateSubCategoryDTO extends SubCategoryDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string;
}