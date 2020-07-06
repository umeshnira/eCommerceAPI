export class OrderModel {

    id: number;
    user_id: number;
    product_id: number;
    status: number;
    price: number;
    qty: number;
    ordered_date: Date;
    purchased_date: Date;
    delivered_date: Date;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
}

