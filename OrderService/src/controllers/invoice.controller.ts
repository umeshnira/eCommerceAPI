import { Request, Response } from 'express';
import { connect, transaction } from '../../../src/context/db.context';
import { validate } from 'class-validator';
import { OrderViewListModel, } from '../models';
import { application } from '../config/app-settings.json';
import fetch from 'node-fetch';

class InvoiceController {

    static getInvoiceOrderDetails = async (req: Request, res: Response) => {

        try {

            const connection = await connect();
            const orderId = req.params?.id;
            const [data] = await connection.query(`
            SELECT distinct
            o.id,
            o.user_id,
            d.id as order_detail_id,
            d.product_id,
            d.status,
            d.price,
            d.qty,
            o.ordered_date,
            d.delivered_date,
            p.offer_id,
            p.offer_name,
            p.name,
            p.image,
            s.name as order_status,
            l.lanmark
            from orders o
            inner join order_details d on o.id=d.order_id
            inner join order_product p on p.order_details_id=d.id
            inner join order_status s on s.id=d.status
            inner join order_location l on l.order_id=o.id
            WHERE o.id = ? and o.is_delete=0 `, [orderId]
            );
            if (data) {
                const order = data as OrderViewListModel[];
                const orderDetails = new Array<OrderViewListModel>();
                const response = await fetch(`http://localhost:1337/ecommerce/sellers`);
                const sellerDetails = await response.json();

                order.forEach(prod => {
                    sellerDetails.forEach(seller => {
                        if (seller.product_id === prod.product_id) {
                            const orderObj = new OrderViewListModel();
                            orderObj.id = prod.id;
                            orderObj.user_id = prod.user_id;
                            orderObj.order_detail_id = prod.order_detail_id;
                            orderObj.product_id = prod.product_id;
                            orderObj.status = prod.status;
                            orderObj.price = prod.price;
                            orderObj.qty = prod.qty;
                            orderObj.ordered_date = prod.ordered_date;
                            orderObj.delivered_date = prod.delivered_date;
                            orderObj.offer_id = prod.offer_id;
                            orderObj.offer_name = prod.offer_name;
                            orderObj.name = prod.name;
                            orderObj.image = prod.image;
                            orderObj.lanmark = prod.lanmark;
                            orderObj.seller_address = seller.address;
                            orderObj.seller_name = seller.name;
                            orderObj.bank_ac_no = seller.bank_ac_no;
                            orderObj.gst_reg_no = seller.gst_reg_no;
                            orderObj.path = application.getImagePath.product + prod.image;
                            orderObj.order_status = prod.order_status;
                            orderDetails.push(orderObj);
                        }

                    });
                });

                if (orderDetails.length) {

                    res.status(200).json(orderDetails);
                } else {
                    res.status(404).send({ message: `Failed to get details` });
                }
            }
        }
        catch (error) {

            res.status(500).send(error.message);
        }
    };

    static getInvoiceClientDetails = async (req: Request, res: Response) => {

        try {

            const connection = await connect();
            const orderId = req.params?.id;
            const [data] = await connection.query(`
            SELECT distinct
            o.id,
            o.user_id,
            d.id as order_detail_id,
            d.product_id,
            d.status,
            d.price,
            d.qty,
            o.ordered_date,
            d.delivered_date,
            p.offer_id,
            p.offer_name,
            p.name,
            p.image,
            s.name as order_status
            from orders o
            inner join order_details d on o.id=d.order_id
            inner join order_product p on p.order_details_id=d.id
            inner join order_status s on s.id=d.status
            WHERE o.id = ? and o.is_delete=0 `, [orderId]
            );
            if (data) {
                const order = data as OrderViewListModel[];
                const orderDetails = new Array<OrderViewListModel>();
                const response = await fetch(`http://localhost:1337/ecommerce/sellers`);
                const sellerDetails = await response.json();

                order.forEach(prod => {
                    sellerDetails.forEach(seller => {
                        if (seller.product_id === prod.product_id) {
                            const orderObj = new OrderViewListModel();
                            orderObj.id = prod.id;
                            orderObj.user_id = prod.user_id;
                            orderObj.order_detail_id = prod.order_detail_id;
                            orderObj.product_id = prod.product_id;
                            orderObj.status = prod.status;
                            orderObj.price = prod.price;
                            orderObj.qty = prod.qty;
                            orderObj.ordered_date = prod.ordered_date;
                            orderObj.delivered_date = prod.delivered_date;
                            orderObj.offer_id = prod.offer_id;
                            orderObj.offer_name = prod.offer_name;
                            orderObj.name = prod.name;
                            orderObj.image = prod.image;
                            orderObj.seller_address = seller.address;
                            orderObj.seller_name = seller.name;
                            orderObj.path = application.getImagePath.product + prod.image;
                            orderObj.order_status = prod.order_status;
                            orderDetails.push(orderObj);
                        }

                    });
                });

                if (orderDetails.length) {

                    res.status(200).json(orderDetails);
                } else {
                    res.status(404).send({ message: `Failed to get details` });
                }
            }
        }
        catch (error) {

            res.status(500).send(error.message);
        }
    };
}

export default InvoiceController;