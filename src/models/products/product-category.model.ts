import { Status } from '../../enums';
import { IsNotEmpty, IsInt } from 'class-validator';

export class ProductCategory {

    id: number;
    product_id: number;

    @IsNotEmpty()
    @IsInt()
    category_id: number;
    status: Status;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}

