import { IsNotEmpty, Length, IsInt } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { ProductCategoryDTO, ProductQuantityDTO, ProductOfferDTO, ProductPriceDTO } from '..';
import { SellerProductsDTO } from '../sellers/seller-products-dto.model';

export class ProductDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    description: string;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    about: string;

    batch_no: number;
    star_rate: number;
    is_returnable: boolean;

    exp_date: Date;
    bar_code: string;
    category: ProductCategoryDTO;
    offers: ProductOfferDTO[];
    price: ProductPriceDTO;
    quantity: ProductQuantityDTO;
    seller: SellerProductsDTO;

    images: string[];

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}