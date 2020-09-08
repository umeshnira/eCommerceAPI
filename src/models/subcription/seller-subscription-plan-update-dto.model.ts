import { IsNotEmpty } from 'class-validator';

export class SellerSubscriptionPlanUpdateDTO {

    @IsNotEmpty()
    subscription_plan_id: number;
    @IsNotEmpty()
    subscription_start_date: Date;
    @IsNotEmpty()
    subscription_end_date: Date;


}