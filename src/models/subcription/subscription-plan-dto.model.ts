import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class SubscriptionPlanDtoModel {

    id: number;

    @IsNotEmpty()
    @IsNotBlank({ message: 'Value cannot contain empty spaces' })
    name: string;

    description: string;

    @IsNotEmpty()
    amount: number;

    offer_id: number;

    type: string;

    status: number;

    @IsNotEmpty()
    created_by: string;

    created_at: Date;

    updated_by: string;

    updated_at: Date;
}