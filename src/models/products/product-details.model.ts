import { Status } from '../../enums';

export class ProductDetails {
    id: number;
    name: string;
    description: string;
    status: Status;
    about: string;
    batch_no: number;
    star_rate:number;
    is_returnable: boolean;
    exp_date: Date;
    bar_code: string;
    category_id: number;
    category: string;
    image: string;
    path: string;
    price: number;
    offer_id: number;
    left_qty: number;
    total_qty: number;
    seller_id: number;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}