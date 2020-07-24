import { IsNotEmpty, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { WishListProductsDTO } from './wish-list-products-dto.model';

export class AddWishListProductsDTO extends WishListProductsDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}
