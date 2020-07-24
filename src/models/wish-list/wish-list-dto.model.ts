import { IsNotEmpty, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../../NotificationService/src/validators';

export class WishListDTO {

    @IsNotEmpty()
    @MaxLength(255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;
}
