import { Length, IsNotEmpty, MaxLength,IsNumber,IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class UpdateOrderDetailsDTO{

    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()

    status: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    ordered_date: Date;

    @IsNotEmpty()
    delivered_date: Date;

    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;

    @IsNotEmpty()
    created_at: Date;
}