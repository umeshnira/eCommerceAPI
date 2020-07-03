import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { OrderModel } from '../models';

class OrderController {

    static getOrders = async (req: Request, res: Response) => {

        try {

            const connection = await connect();
            const [data] = await connection.query('SELECT * from `orders`');
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
            const [data] = await connection.query('SELECT * FROM `orders` WHERE `id` = ?', [orderId]);
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
            await transaction(pool, async connection => {
                const order = new OrderModel();
                const [data] = await connection.query('INSERT INTO `orders` SET ?', [order]);
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
            const pool = await connect();
            await transaction(pool, async connection => {
                const order = new OrderModel();
                const [data] = await connection.query('UPDATE `orders` SET ? WHERE `id` = ?', [order, orderId]);
                res.status(201).send('Order created');
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
                const [data] = await connection.query('DELETE FROM `orders` WHERE `id` = ?', [orderId]);
            });

            res.status(204).send('Order is deleted');
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default OrderController;

