import { IsNotEmpty, IsInt } from 'class-validator';

export class SellerProductsDTO {

    @IsNotEmpty()
    @IsInt()
    seller_id: number;

}

