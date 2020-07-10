import { Length, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class OrderDetailsDTO {

    id: number;

    @IsNumber()
    @IsNotEmpty()
    order_id: number;

    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()

    status: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    qty: number;

    @IsNotEmpty()
    delivered_date: Date;

    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    created_by: string;

    @IsNotEmpty()
    created_at: Date;

    updated_by: string;

    updated_at: Date;
}