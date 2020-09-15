import { IsNotEmpty, Length, IsInt } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class CouponDtoModel {

    id: number;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    code: string;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    description: string;
    price: number;
    discount_type: number;
    free_shipping: number;
    on_store: number;
    limit_per_coupon: number;
    limit_per_item: number;
    limit_per_user: number;
    percentage: number;
    start_date: Date;
    end_date: Date;
    status: number;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}