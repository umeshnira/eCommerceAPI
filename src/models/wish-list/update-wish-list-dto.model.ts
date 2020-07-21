import { IsNotEmpty, Length } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { WishListDTO } from './wish-list-dto.model';

export class UpdateWishListDTO extends WishListDTO {

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    updated_by: string
}
