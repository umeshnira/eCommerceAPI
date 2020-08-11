import { IsNotEmpty, Length, IsInt } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class MultipleProductOfferDTOModel {

    @IsNotEmpty()
    product_id: [];

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string;

}