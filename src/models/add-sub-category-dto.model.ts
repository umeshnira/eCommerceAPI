import { Length, IsNotEmpty, MaxLength, isInt, IsInt } from 'class-validator';
import { IsNotBlank } from '../validators';

export class AddSubCategoryDTO {

    @IsNotEmpty()
    @MaxLength(255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    description: string;

    @IsNotEmpty()
    @IsInt()
    parentId: number;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}