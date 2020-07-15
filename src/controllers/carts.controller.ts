import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AddCartDTO, CartModel, UpdateCartDTO } from '../models';
import { connect, transaction } from '../context/db.context';

class CartController {

    static getCartItems = async (req: Request, res: Response) => {

        try {
            const userId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id, prod.name, prod.description, price.price,
                        offer.offer_id, qty.left_qty, qty.total_qty, cart.id as CartId,
                        cart.quantity, ima.image
                        FROM carts cart
                        INNER JOIN products prod ON prod.id = cart.product_id
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        INNER JOIN product_offers offer ON prod.id = offer.product_id
                        INNER JOIN product_quantity qty ON prod.id = qty.product_id
                        INNER JOIN product_categories cat ON prod.id = cat.product_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id WHERE cart.user_id = ?
                        GROUP By prod.id`, [userId]
            );
            const carts = data as CartModel[];
            if (carts.length) {
                res.status(200).json(carts);
            } else {
                res.status(404).send(`Cart with Id: ${userId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static createCart = async (req: Request, res: Response) => {

        try {
            const cartDto = Object.assign(new AddCartDTO(), req.body);

            const errors = await validate(cartDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const cart = cartDto as CartModel;
            cart.created_at = new Date();

            let data: any;
            const pool = await connect();

            let cartId: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO carts SET ?`, [cart]
                );
                cartId = data.insertId;
                [data] = await connection.query(
                    `DELETE FROM save_later WHERE product_id = ? AND user_id = ?`, [cart.product_id, cart.user_id]
                );
            });

            if (cartId) {
                res.status(201).send({ message : `Cart with Id: ${cartId} is created` });
            } else {
                res.status(500).send(`Failed to Add the product to cart`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static updateCart = async (req: Request, res: Response) => {

        try {
            const cartId = req.params.id;
            const cartDto = Object.assign(new UpdateCartDTO(), req.body);

            const errors = await validate(cartDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const cart = cartDto as CartModel;
            cart.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM carts WHERE id = ?`, [cartId]
            );
            const cartExists = data as CartModel[];
            if (!cartExists.length) {
                res.status(404).send(`Cart with Id: ${cartExists} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE carts SET ? WHERE id = ?`, [cart, cartId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send({ message : `Cart with Id: ${cartId} is updated` });
            } else {
                res.status(500).send(`Cart with Id: ${cartId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static deleteCart = async (req: Request, res: Response) => {

        try {
            const cartId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM carts WHERE id = ?`, [cartId]
            );

            const cartExists = data as CartModel[];
            if (!cartExists.length) {
                res.status(404).send(`Cart with Id: ${cartExists} not found`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `DELETE FROM carts  WHERE id = ?`, [cartId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send({ message : `Cart with Id: ${cartId} is deleted` });
            } else {
                res.status(500).send(`Cart with Id: ${cartId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default CartController;