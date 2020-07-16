import { Length, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class OrderDetailsDTO {

    id: number;


    order_id: number;

    @IsNumber()
    @IsNotEmpty()
    product_id: number;

 

    status: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    qty: number;


    delivered_date: Date;

    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    created_by: string;


    created_at: Date;

    updated_by: string;

    updated_at: Date;
}