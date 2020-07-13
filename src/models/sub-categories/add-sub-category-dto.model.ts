import { Length, IsNotEmpty, IsInt } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { SubCategoryDTO } from '..';

export class AddSubCategoryDTO extends SubCategoryDTO {

    @IsNotEmpty()
    @IsInt()
    parent_category_id: number;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}