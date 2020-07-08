import { Status } from '../../enums';
import { ProductImageDTO } from './product-image-dto.model';

export class Product {

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
    images: ProductImageDTO[] = [];
    offer_id: number;
    price: number;
    left_qty: number;
    total_qty: number;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}
