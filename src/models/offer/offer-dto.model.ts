import { IsNotEmpty, Length, IsInt } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class OfferDTOModel {

    id: number;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    description: string;

    price: number;
    
    percentage: number;

    @IsNotEmpty()
    ValidFrom: Date;

    @IsNotEmpty()
    ValidTo: Date;

    status: number;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    created_by: string;

    created_at: Date;

    updated_by: string;

    updated_at: Date;
}