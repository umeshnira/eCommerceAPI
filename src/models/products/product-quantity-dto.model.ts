import { IsNotEmpty, IsInt } from 'class-validator';

export class ProductQuantityDTO {


    @IsNotEmpty()
    @IsInt()
    left_qty: number;

    @IsNotEmpty()
    @IsInt()
    total_qty: number;
}

