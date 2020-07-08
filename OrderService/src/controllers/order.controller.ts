import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { OrderModel, OrderDetailsModel, OrderLocationModel, OrderOffersModel, AddOrdersDTO, AddOrderDetailsDTO, AddOrderLocationDTO, AddOrderOfferDTO,UpdateOrderDetailsDTO,UpdateOrderLocationDTO,UpdateOrderOfferDTO } from '../models';
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
            d.ordered_date,
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
            inner join order_offers f on f.order_detail_id=d.id
            inner join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            where o.is_delete=0 and d.is_delete=0
            group by d.id
            `);
            if (data) {
                res.status(200).json(data);
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
            d.ordered_date,
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
            inner join order_offers f on f.order_detail_id=d.id
            inner join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.id = ? and o.is_delete=0 and d.is_delete=0`, [orderId]
            );
            if (data) {
                res.status(200).json(data[0]);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createOrder = async (req: any, res: Response) => {

        try {

            const pool = await connect();

            const orderDto = Object.assign(new AddOrdersDTO(), req.body.order);
            const errors = await validate(orderDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
            const order = Object.assign(new OrderModel(), orderDto);
            await transaction(pool, async connection => {

                await connection.query('INSERT INTO `orders` SET ?', [order]);
                const [orderId] = await connection.query(`select max(id) as orderId from orders`);

                req.body.location.order_id = orderId[0].orderId;

                const locationDto = Object.assign(new AddOrderLocationDTO(), req.body.location);
                const errors = await validate(locationDto);
                if (errors.length > 0) {
                    res.status(400).send(errors);
                    return;
                }
                const location = Object.assign(new OrderLocationModel(), locationDto);
                await connection.query('INSERT INTO `order_location` SET ?', [location]);

                for (var i = 0; i < req.body.details.length; i++) {

                    req.body.details[i].order_id = orderId[0].orderId;

                    const detailsDto = Object.assign(new AddOrderDetailsDTO(), req.body.details[i]);
                    const errors = await validate(detailsDto);
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return;
                    }
                    const details = Object.assign(new OrderDetailsModel(), detailsDto);
                    await connection.query('INSERT INTO `order_details` SET ?', [details]);
                    const [order_detail_id] = await connection.query(`select max(id) as order_detail_id from order_details`);

                    req.body.offer[i].order_detail_id = order_detail_id[0].order_detail_id;

                    const offerDto = Object.assign(new AddOrderOfferDTO(), req.body.offer[i]);
                    const errors1 = await validate(offerDto);
                    if (errors1.length > 0) {
                        res.status(400).send(errors1);
                        return;
                    }
                    const offer = Object.assign(new OrderOffersModel(), offerDto);

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
            const pool = await connect();
            await transaction(pool, async connection => {

                const orderDto = Object.assign(new AddOrdersDTO(), req.body.order);
                const errors = await validate(orderDto);
                if (errors.length > 0) {
                    res.status(400).send(errors);
                    return;
                }
                const order = Object.assign(new OrderModel(), orderDto);
                
                const detailsDto = Object.assign(new UpdateOrderDetailsDTO(), req.body.details);
                const errors1 = await validate(detailsDto);
                if (errors1.length > 0) {
                    res.status(400).send(errors1);
                    return;
                }
                const details = Object.assign(new OrderDetailsModel(), detailsDto);

                const locationDto = Object.assign(new UpdateOrderLocationDTO(), req.body.location);
                const errors2 = await validate(locationDto);
                if (errors2.length > 0) {
                    res.status(400).send(errors2);
                    return;
                }
                const location = Object.assign(new OrderLocationModel(), locationDto);
               
                const offerDto = Object.assign(new UpdateOrderOfferDTO(), req.body.offer);
                const errors3 = await validate(offerDto);
                if (errors3.length > 0) {
                    res.status(400).send(errors3);
                    return;
                }
                const offer = Object.assign(new OrderOffersModel(), offerDto);

                await connection.query('UPDATE `orders` SET ? WHERE `id` = ?', [order, orderId]);
                await connection.query('UPDATE `order_details` SET ? WHERE `id` = ?', [details, detailId]);
                await connection.query('UPDATE `order_location` SET ? WHERE `order_id` = ?', [location, orderId]);
                await connection.query('UPDATE `order_offers` SET ? WHERE `order_detail_id` = ?', [offer, detailId]);

                res.status(201).send('Order Updated');
            });
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
                await connection.query('UPDATE `order_location` SET is_delete=1 WHERE `order_id` = ?', [orderId]);
                await connection.query('UPDATE `order_details` SET is_delete=1 WHERE `order_id` = ?', [orderId]);
                const [order_detail_id] = await connection.query(`select id  from order_details  WHERE order_id = ?`, [orderId]);
                for (var i = 0; i < order_detail_id.length; i++) {
                    await connection.query('UPDATE `order_offers` SET is_delete=1 WHERE `order_detail_id` = ?', [order_detail_id[i].id]);
                }
                res.status(204).send('Order is deleted');

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
            d.ordered_date,
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
            inner join order_offers f on f.order_detail_id=d.id
            inner join offers k on k.id=f.offer_id
            inner join order_status s on s.id=d.status
            WHERE o.user_id = ? and o.is_delete=0 and d.is_delete=0
            group by d.id`, [userId]);
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default OrderController;

