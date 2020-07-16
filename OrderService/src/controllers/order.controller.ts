import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { OrderModel, OrderDetailsModel, OrderLocationModel, OrderOffersModel, OrdersDTO, OrderViewListModel, OrderMailViewListModel, OrderLocationDTO } from '../models';
import { validate } from 'class-validator';
import { application } from '../config/app-settings.json';

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
            left join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            where o.is_delete=0 
            group by d.id
            `);
            if (data) {
                const order = data as OrderViewListModel[];
                const orderDetails = new Array<OrderViewListModel>();
                order.forEach(prod => {
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
                    orderObj.path = application.getImagePath.product + prod.image;
                    orderObj.order_status = prod.order_status;
                    orderDetails.push(orderObj);
                });

                res.status(200).json(orderDetails);
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
            left join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.id = ? and o.is_delete=0 `, [orderId]
            );
            if (data) {
                const order = data as OrderViewListModel[];
                const orderDetails = new Array<OrderViewListModel>();
                order.forEach(prod => {
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
                    orderObj.path = application.getImagePath.product + prod.image;
                    orderObj.order_status = prod.order_status;
                    orderDetails.push(orderObj);
                });

                res.status(200).json(orderDetails);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
    static getOrderForMail = async (req: Request, res: Response) => {

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
            s.name as order_status,
            l.name as full_name,
            l.address,
            l.email,
            l.phone
            from orders o 
            inner join order_details d on o.id=d.order_id
            inner join products p on p.id=d.product_id
            inner join product_images i on p.id=i.product_id
            left join order_offers f on f.order_detail_id=d.id
            left join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            inner join order_location l on o.id=l.order_id
            WHERE o.id = ? and o.is_delete=0 `, [orderId]
            );
            if (data) {
                const order = data as OrderMailViewListModel[];
                const orderDetails = new Array<OrderMailViewListModel>();
                order.forEach(prod => {
                    const orderObj = new OrderMailViewListModel();
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
                    orderObj.path = application.getImagePath.product + prod.image;
                    orderObj.order_status = prod.order_status;
                    orderObj.address = prod.address;
                    orderObj.full_name = prod.full_name;
                    orderObj.phone = prod.phone;
                    orderObj.email = prod.email;
                    orderDetails.push(orderObj);
                });

                res.status(200).json(orderDetails);
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
                order.status = 1;
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
                location.lanmark = orderDto.location.landmark;
                location.pincode = orderDto.location.pin_code;
                location.email = orderDto.location.email;
                location.phone = orderDto.location.phone;
                location.location_date = new Date();
                location.created_by = orderDto.location.created_by;
                location.created_date = new Date();
                console.log(JSON.stringify(location));

                await connection.query('INSERT INTO `order_location` SET ?', [location]);

                for (var i = 0; i < orderDto.details.length; i++) {

                    const details = new OrderDetailsModel();
                    details.order_id = orderId;
                    details.product_id = orderDto.details[i].product_id;
                    details.status = 1;
                    details.price = orderDto.details[i].price;
                    details.qty = orderDto.details[i].qty;
                    details.created_by = orderDto.details[i].created_by;
                    details.created_at = new Date();

                    [data] = await connection.query('INSERT INTO `order_details` SET ?', [details]);

                    if (orderDto.offer[i].offer_id) {
                        const order_detail_id = data.insertId;

                        const offer = new OrderOffersModel();
                        offer.order_detail_id = order_detail_id;
                        offer.offer_id = orderDto.offer[i].offer_id;
                        offer.created_by = orderDto.offer[i].created_by;
                        offer.created_at = new Date();

                        await connection.query('INSERT INTO `order_offers` SET ?', [offer]);
                    }
                }


                res.status(201).json(orderId);
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
            left join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.user_id = ? and o.is_delete=0 
            group by d.id`, [userId]);
            if (data) {
                const order = data as OrderViewListModel[];
                const orderDetails = new Array<OrderViewListModel>();
                order.forEach(prod => {
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
                    orderObj.path = application.getImagePath.product + prod.image;
                    orderObj.order_status = prod.order_status;
                    orderDetails.push(orderObj);
                });

                res.status(200).json(orderDetails);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static cancelOrder = async (req: Request, res: Response) => {
        try {
            const Id = req.params.id;

            const pool = await connect();
            await transaction(pool, async connection => {
                await connection.query('UPDATE `order_details` SET status=3 WHERE `id` = ?', [Id]);

                res.status(200).send('Order is cancelled');

            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getUserCancelOrders = async (req: Request, res: Response) => {

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
            left join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.user_id = ? and o.is_delete=0  and d.status=3
            group by d.id`, [userId]);
            if (data) {
                const order = data as OrderViewListModel[];
                const orderDetails = new Array<OrderViewListModel>();
                order.forEach(prod => {
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
                    orderObj.path = application.getImagePath.product + prod.image;
                    orderObj.order_status = prod.order_status;
                    orderDetails.push(orderObj);
                });

                res.status(200).json(orderDetails);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

}


export default OrderController;

