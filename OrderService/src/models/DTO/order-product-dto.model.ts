import { Length, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class OrderProductDTOModel {

    id: number;

    @IsNumber()
    @IsNotEmpty()
    order_details_id: number;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    image: string;

    offer_id: number;

    offer_name: string;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    created_by: string;

    @IsNotEmpty()
    created_at: Date;

    updated_by: string;

    updated_at: Date;
}