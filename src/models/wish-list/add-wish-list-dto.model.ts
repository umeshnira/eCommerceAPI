import { IsNotEmpty, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { WishListDTO } from './wish-list-dto.model';

export class AddWishListDTO extends WishListDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}
