import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { OrderModel, OrderDetailsModel, OrderLocationModel, OrderOffersModel, OrdersDTO,OrderViewListModel } from '../models';
import { validate } from 'class-validator';

class OrderController {

    static getOrders = async (req: Request, res: Response) => {

        try {

            const connection = await connect();
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
            f.offer_id,
            k.name as offer_name,
            p.name,
            i.image,
            s.name as order_status
            from orders o 
            inner join order_details d on o.id=d.order_id
            inner join products p on p.id=d.product_id
            inner join product_images i on p.id=i.product_id
            left join order_offers f on f.order_detail_id=d.id
            inner join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            where o.is_delete=0 
            group by d.id
            `);
            if (data) {
                const order= data as OrderViewListModel[];
                res.status(200).json(order);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getOrder = async (req: Request, res: Response) => {

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
            f.offer_id,
            k.name as offer_name,
            p.name,
            i.image,
            s.name as order_status
            from orders o 
            inner join order_details d on o.id=d.order_id
            inner join products p on p.id=d.product_id
            inner join product_images i on p.id=i.product_id
            left join order_offers f on f.order_detail_id=d.id
            inner join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.id = ? and o.is_delete=0 `, [orderId]
            );
            if (data) {
                const order= data[0] as OrderViewListModel[];
                res.status(200).json(order);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createOrder = async (req: any, res: Response) => {

        try {

            const orderDto = Object.assign(new OrdersDTO(), req.body.data);
            const errors = await validate(orderDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();
            await transaction(pool, async connection => {

                const order = new OrderModel();
                order.user_id = orderDto.user_id;
                order.status = orderDto.status;
                order.ordered_date = new Date();
                order.created_by = orderDto.created_by;
                order.created_at = new Date();
                order.is_delete = 0;

                [data] = await connection.query('INSERT INTO `orders` SET ?', [order]);
                const orderId = data.insertId;

                const location = new OrderLocationModel();
                location.order_id = orderId;
                location.name = orderDto.location.name;
                location.address = orderDto.location.address;
                location.lanmark = orderDto.location.lanmark;
                location.pincode = orderDto.location.pincode;
                location.email = orderDto.location.email;
                location.phone = orderDto.location.phone;
                location.location_date = orderDto.location.location_date;
                location.created_by = orderDto.location.created_by;
                location.created_date = new Date();

                await connection.query('INSERT INTO `order_location` SET ?', [location]);

                for (var i = 0; i < orderDto.details.length; i++) {

                    const details = new OrderDetailsModel();
                    details.order_id = orderId;
                    details.product_id = orderDto.details[i].product_id;
                    details.status = orderDto.details[i].status;
                    details.price = orderDto.details[i].price;
                    details.qty = orderDto.details[i].qty;
                    details.created_by = orderDto.details[i].created_by;
                    details.created_at = new Date();

                    [data] = await connection.query('INSERT INTO `order_details` SET ?', [details]);
                    const order_detail_id = data.insertId;

                    const offer = new OrderOffersModel();
                    offer.order_detail_id = order_detail_id;
                    offer.offer_id = orderDto.offer[i].offer_id;
                    offer.created_by = orderDto.offer[i].created_by;
                    offer.created_at = new Date();

                    await connection.query('INSERT INTO `order_offers` SET ?', [offer]);
                }


                res.status(201).send('Order created');
            });
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateOrder = async (req: any, res: Response) => {

        try {

            const orderId = req.params.id;
            const detailId = req.params.detailId;

            const orderDto = Object.assign(new OrdersDTO(), req.body.data);
            const errors = await validate(orderDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
            const pool = await connect();
            let data: any;
            let isUpdated: any;
            await transaction(pool, async connection => {

                const order = new OrderModel();
                order.user_id = orderDto.user_id;
                order.status = orderDto.status;
                order.ordered_date = new Date();
                order.updated_by = orderDto.updated_by;
                order.updated_at = new Date();

                [data] = await connection.query('UPDATE `orders` SET ? WHERE `id` = ?', [order, orderId]);
                isUpdated = data.affectedRows > 0;
                if (isUpdated) {

                    const details = new OrderDetailsModel();
                    details.product_id = orderDto.details.product_id;
                    details.status = orderDto.details.status;
                    details.price = orderDto.details.price;
                    details.qty = orderDto.details.qty;
                    details.updated_by = orderDto.details.updated_by;
                    details.updated_at = new Date();

                    await connection.query('UPDATE `order_details` SET ? WHERE `id` = ?', [details, detailId]);
                  
                    const location = new OrderLocationModel();
                    location.name = orderDto.location.name;
                    location.address = orderDto.location.address;
                    location.lanmark = orderDto.location.lanmark;
                    location.pincode = orderDto.location.pincode;
                    location.email = orderDto.location.email;
                    location.phone = orderDto.location.phone;
                    location.location_date = orderDto.location.location_date;
                    location.updated_by = orderDto.location.updated_by;
                    location.updated_date = new Date();

                    await connection.query('UPDATE `order_location` SET ? WHERE `order_id` = ?', [location, orderId]);
                   
                    const offer = new OrderOffersModel();
                    offer.offer_id = orderDto.offer.offer_id;
                    offer.updated_by = orderDto.offer.updated_by;
                    offer.updated_at = new Date();

                    await connection.query('UPDATE `order_offers` SET ? WHERE `order_detail_id` = ?', [offer, detailId]);

                }
            });
            if (isUpdated) {
                res.status(200).send(`Updated the order with Id: ${orderId}`);
            } else {
                res.status(500).send(`Failed to update a order`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteOrder = async (req: Request, res: Response) => {

        try {
            const orderId = req.params.id;

            const pool = await connect();
            await transaction(pool, async connection => {
                await connection.query('UPDATE `orders` SET is_delete=1 WHERE `id` = ?', [orderId]);
  
                res.status(200).send('Order is deleted');

            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getUserOrders = async (req: Request, res: Response) => {

        try {

            const connection = await connect();
            const userId = req.params?.id;
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
            f.offer_id,
            k.name as offer_name,
            p.name,
            i.image,
            s.name as order_status
            from orders o 
            inner join order_details d on o.id=d.order_id
            inner join products p on p.id=d.product_id
            inner join product_images i on p.id=i.product_id
            left join order_offers f on f.order_detail_id=d.id
            inner join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.user_id = ? and o.is_delete=0 
            group by d.id`, [userId]);
            if (data) {
                const order= data as OrderViewListModel[];
                res.status(200).json(order);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default OrderController;

