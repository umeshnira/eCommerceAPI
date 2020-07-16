import { Length, IsNotEmpty, MaxLength, IsNumber, IsDateString } from 'class-validator';
import { IsNotBlank } from '../../validators';
import { OrderDetailsDTO } from './order-details-dto.model'
import { OrderLocationDTO } from './order-location-dto.model'
import { OrderOfferDTO } from './order-offers-dto.model'

export class OrdersDTO {

    id: number;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;

 
    status: number;


    ordered_date: Date;

    @IsNotEmpty()
    @Length(1, 50)
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    created_by: string;

 
    created_at: Date;

    details: OrderDetailsDTO[];

    location: OrderLocationDTO[];

    offer: OrderOfferDTO[]

    updated_by: string;

    updated_at: Date;

    is_delete: number;
}