export class OrderViewListModel {
    id: number;
    user_id: number;
    order_detail_id: number;
    product_id: number;
    status: number;
    price: number;
    qty: number;
    ordered_date: Date;
    delivered_date: Date;
    offer_id: number;
    offer_name: string;
    name: string;
    image: string;
    path:string;
    order_status: string;
}