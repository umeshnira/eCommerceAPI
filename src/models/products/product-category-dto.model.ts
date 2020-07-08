import { IsNotEmpty, IsInt } from 'class-validator';

export class ProductCategoryDTO {

    @IsNotEmpty()
    @IsInt()
    category_id: number;
}

