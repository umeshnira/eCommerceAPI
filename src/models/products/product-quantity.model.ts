import { IsNotEmpty, IsInt } from 'class-validator';

export class ProductQuantity {

    id: number;
    product_id: number;

    @IsNotEmpty()
    @IsInt()
    left_qty: number;

    @IsNotEmpty()
    @IsInt()
    total_qty: number;

    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

