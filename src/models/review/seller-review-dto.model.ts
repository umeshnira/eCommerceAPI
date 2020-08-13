import { Length, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class SellerReviewDtoModel {


    id: number;

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    title: string;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    description: string;

    @IsNotEmpty()
    rate: number;


    status: number;

    @IsNotEmpty()
    seller_id: number;

    date: Date;

    @IsNotEmpty()

    created_by: string;


    created_at: Date;

    updated_by: string;

    updated_at: Date;

}