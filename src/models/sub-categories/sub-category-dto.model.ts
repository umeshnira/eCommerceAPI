import { IsNotEmpty, MaxLength, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class SubCategoryDTO {

    @IsNotEmpty()
    @MaxLength(255)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    description: string;
}