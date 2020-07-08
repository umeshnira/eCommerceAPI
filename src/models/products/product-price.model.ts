import { IsNotEmpty, IsInt } from 'class-validator';

export class ProductPrice {

    id: number;
    product_id: number;

    @IsNotEmpty()
    @IsInt()
    price: number;

    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}

