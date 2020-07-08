import { IsNotEmpty, IsInt } from 'class-validator';

export class ProductPriceDTO {

    @IsNotEmpty()
    @IsInt()
    price: number;
}

