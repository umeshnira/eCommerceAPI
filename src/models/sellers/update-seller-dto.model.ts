import { Length, IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { SellerDTO } from '..';

export class UpdateSellerDTO extends SellerDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string;
}