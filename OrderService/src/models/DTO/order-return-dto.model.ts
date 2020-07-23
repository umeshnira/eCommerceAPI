import { Length, IsNotEmpty, MaxLength, IsNumber, IsDate } from 'class-validator';
import { IsNotBlank } from '../../validators';

export class OrderReturnDTOModel {

    id: number;

    @IsNotEmpty()
    order_detail_id: number;

    @IsNotEmpty()
    reason: string;

    conclusion: string;

    @IsNotEmpty()
    created_by: string;

    created_at: Date;

    updated_by: string;

    updated_at: Date;
}