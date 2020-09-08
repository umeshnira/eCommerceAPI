import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class SubscriptionPlanDtoModel{

    id: number;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    name: string;

    @IsNotEmpty()
    @IsNotBlank({  message: 'Value cannot contain empty spaces' })
    description: string;

    @IsNotEmpty()
    amount: number;

    offer_id: number;

    no_days_valid: number;

    status: number;

    @IsNotEmpty()
    created_by: string;

    created_at: Date;

    updated_by: string;

    updated_at: Date;
}