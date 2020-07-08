import { Length, IsNotEmpty, MaxLength,IsNumber,IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class AddOrderOfferDTO {

    @IsNumber()
    @IsNotEmpty()
    order_detail_id: number;

    @IsNumber()
    @IsNotEmpty()
    offer_id: number;

    @IsNotEmpty()
    created_at: Date;

    @IsNotEmpty()
    @Length(1, 255)
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;
}