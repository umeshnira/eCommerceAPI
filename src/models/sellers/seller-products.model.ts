import { IsNotEmpty, IsInt } from 'class-validator';
import { Status } from '../../enums';

export class SellerProducts {

    id: number;
    product_id: number;

    @IsNotEmpty()
    @IsInt()
    seller_id: number;
    status: Status;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}

